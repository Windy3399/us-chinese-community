/**
 * Cron Worker - 处理定时任务
 * 1. 每天 0:00 更新汇率数据
 * 2. 每天 2:00 清理过期帖子
 */

interface Env {
  KV: KVNamespace;
  DB: D1Database;
  R2: R2Bucket;
}

const EXCHANGE_RATE_KEY = "exchange_rate_usd_cny";
const CLEANUP_STATS_KEY = "cleanup_stats";

// ============ 汇率更新相关 ============

// 主要 API: exchangerate-api.com
async function fetchFromPrimaryAPI(): Promise<{ rate: number; source: string } | null> {
  try {
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    if (!response.ok) {
      throw new Error(`Primary API failed: ${response.status}`);
    }
    const data = await response.json();
    const rate = data.rates?.CNY;
    if (rate && rate > 6 && rate < 8) { // 合理范围检查
      return { rate, source: "exchangerate-api.com" };
    }
    return null;
  } catch (error) {
    console.error("Primary API error:", error);
    return null;
  }
}

// 备用 API 1: frankfurter.app
async function fetchFromFrankfurter(): Promise<{ rate: number; source: string } | null> {
  try {
    const response = await fetch("https://api.frankfurter.app/latest?from=USD&to=CNY");
    if (!response.ok) {
      throw new Error(`Frankfurter API failed: ${response.status}`);
    }
    const data = await response.json();
    const rate = data.rates?.CNY;
    if (rate && rate > 6 && rate < 8) {
      return { rate, source: "frankfurter.app" };
    }
    return null;
  } catch (error) {
    console.error("Frankfurter API error:", error);
    return null;
  }
}

// 备用 API 2: open.er-api.com
async function fetchFromOpenExchangeRates(): Promise<{ rate: number; source: string } | null> {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD");
    if (!response.ok) {
      throw new Error(`Open Exchange Rates API failed: ${response.status}`);
    }
    const data = await response.json();
    const rate = data.rates?.CNY;
    if (rate && rate > 6 && rate < 8) {
      return { rate, source: "open.er-api.com" };
    }
    return null;
  } catch (error) {
    console.error("Open Exchange Rates API error:", error);
    return null;
  }
}

async function fetchExchangeRate(): Promise<{ rate: number; source: string } | null> {
  return (
    (await fetchFromPrimaryAPI()) ||
    (await fetchFromFrankfurter()) ||
    (await fetchFromOpenExchangeRates())
  );
}

async function updateExchangeRate(env: Env): Promise<void> {
  console.log("Cron triggered: Fetching exchange rate...");

  try {
    const result = await fetchExchangeRate();

    if (!result) {
      console.error("All exchange rate APIs failed");
      return;
    }

    const rateData = {
      rate: result.rate,
      rateString: result.rate.toFixed(4),
      source: result.source,
      updatedAt: new Date().toISOString()
    };

    await env.KV.put(EXCHANGE_RATE_KEY, JSON.stringify(rateData), {
      expirationTtl: 86400 // 24小时
    });

    console.log(`Exchange rate updated: 1 USD = ${result.rate} CNY (${result.source})`);
  } catch (error) {
    console.error("Failed to update exchange rate:", error);
  }
}

// ============ 清理过期帖子相关 ============

interface PostWithImages {
  id: string;
  image_urls: string[];
}

async function getExpiredPosts(env: Env, limit: number = 100): Promise<PostWithImages[]> {
  try {
    // 查询过期帖子和对应的图片
    const query = `
      SELECT
        p.id,
        p.expires_at,
        GROUP_CONCAT(pi.image_url) as image_urls
      FROM posts p
      LEFT JOIN post_images pi ON p.id = pi.post_id
      WHERE p.expires_at IS NOT NULL
        AND p.expires_at <= datetime('now')
        AND p.status != 'expired'
      GROUP BY p.id
      LIMIT ?
    `;

    const stmt = env.DB.prepare(query);
    const result = await stmt.bind(limit).all();

    if (!result.results || result.results.length === 0) {
      return [];
    }

    return result.results.map((row: any) => ({
      id: row.id,
      image_urls: row.image_urls ? row.image_urls.split(",") : []
    }));
  } catch (error) {
    console.error("Failed to fetch expired posts:", error);
    return [];
  }
}

async function deleteR2Images(env: Env, imageUrls: string[]): Promise<number> {
  let deletedCount = 0;

  for (const url of imageUrls) {
    try {
      // 从 URL 提取 R2 key
      // 例如: https://r2.dev/images/user-id/filename.webp -> images/user-id/filename.webp
      const key = extractR2Key(url);
      if (key) {
        await env.R2.delete(key);
        deletedCount++;
        console.log(`Deleted R2 image: ${key}`);
      }
    } catch (error) {
      console.error(`Failed to delete R2 image ${url}:`, error);
    }
  }

  return deletedCount;
}

function extractR2Key(url: string): string | null {
  try {
    // 移除域名部分，保留路径
    // 支持格式: https://domain/path 或 /path
    const urlObj = new URL(url, "https://placeholder.com");
    return urlObj.pathname.startsWith("/") ? urlObj.pathname.slice(1) : urlObj.pathname;
  } catch {
    // 如果不是有效 URL，可能是相对路径
    return url.startsWith("/") ? url.slice(1) : url;
  }
}

async function deletePosts(env: Env, postIds: string[]): Promise<number> {
  if (postIds.length === 0) return 0;

  try {
    // 更新帖子状态为 expired（ON DELETE CASCADE 会自动删除评论）
    // 但保留 post_images 记录，因为我们要先删除图片
    const placeholders = postIds.map(() => "?").join(",");
    const query = `
      UPDATE posts
      SET status = 'expired', updated_at = datetime('now')
      WHERE id IN (${placeholders})
    `;

    const stmt = env.DB.prepare(query);
    const result = await stmt.bind(...postIds).run();

    console.log(`Marked ${result.meta?.last_row_id || 0} posts as expired`);
    return postIds.length;
  } catch (error) {
    console.error("Failed to mark posts as expired:", error);
    return 0;
  }
}

async function saveCleanupStats(env: Env, stats: {
  postsProcessed: number;
  postsMarkedExpired: number;
  imagesDeleted: number;
  timestamp: string;
}): Promise<void> {
  try {
    const statsHistory = await env.KV.get("cleanup_stats_history");
    let history = statsHistory ? JSON.parse(statsHistory) : [];

    history.push(stats);

    // 保留最近 30 天的记录
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    history = history.filter((s: any) => new Date(s.timestamp).getTime() > thirtyDaysAgo);

    await env.KV.put("cleanup_stats_history", JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save cleanup stats:", error);
  }
}

async function cleanupExpiredPosts(env: Env): Promise<void> {
  console.log("Cron triggered: Cleaning up expired posts...");

  try {
    // 1. 查询过期帖子（最多100条）
    const expiredPosts = await getExpiredPosts(env, 100);

    if (expiredPosts.length === 0) {
      console.log("No expired posts found");
      return;
    }

    console.log(`Found ${expiredPosts.length} expired posts`);

    let totalImagesDeleted = 0;
    const postIds: string[] = [];

    // 2. 删除 R2 图片
    for (const post of expiredPosts) {
      const imageUrls = post.image_urls.filter((url): url is string => !!url);
      const deletedCount = await deleteR2Images(env, imageUrls);
      totalImagesDeleted += deletedCount;
      postIds.push(post.id);
    }

    // 3. 删除 D1 记录（标记为 expired 状态）
    const postsMarked = await deletePosts(env, postIds);

    // 4. 记录统计到 KV
    const stats = {
      postsProcessed: expiredPosts.length,
      postsMarkedExpired: postsMarked,
      imagesDeleted: totalImagesDeleted,
      timestamp: new Date().toISOString()
    };

    await saveCleanupStats(env, stats);

    console.log(`Cleanup completed: ${stats.postsMarkedExpired} posts, ${stats.imagesDeleted} images deleted`);
  } catch (error) {
    console.error("Failed to cleanup expired posts:", error);
  }
}

// ============ 主入口 ============

export async function scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
  const cron = controller.cron;

  if (cron === "0 0 * * *") {
    // 每天午夜：更新汇率
    await updateExchangeRate(env);
  } else if (cron === "0 2 * * *") {
    // 每天凌晨2点：清理过期帖子
    await cleanupExpiredPosts(env);
  } else {
    console.log(`Unknown cron schedule: ${cron}`);
  }
}
