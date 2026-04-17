/**
 * Cron Worker - 处理定时任务
 * 1. 每天 0:00 更新汇率数据
 * 2. 每天 2:00 清理过期帖子
 */

export async function scheduled(controller, env, ctx) {
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

// ============ 汇率更新相关 ============

async function updateExchangeRate(env) {
  console.log("Cron triggered: Fetching exchange rate...");

  try {
    const rate = await fetchExchangeRate();

    if (!rate) {
      console.error("All exchange rate APIs failed");
      return;
    }

    const rateData = {
      rate: rate,
      rateString: rate.toFixed(4),
      source: "exchangerate-api.com",
      updatedAt: new Date().toISOString()
    };

    await env.KV.put("exchange_rate_usd_cny", JSON.stringify(rateData), {
      expirationTtl: 86400 // 24小时
    });

    console.log(`Exchange rate updated: 1 USD = ${rate} CNY`);
  } catch (error) {
    console.error("Failed to update exchange rate:", error);
  }
}

async function fetchExchangeRate() {
  try {
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    if (!response.ok) throw new Error(`API failed: ${response.status}`);
    const data = await response.json();
    const rate = data.rates?.CNY;
    if (rate && rate > 6 && rate < 8) {
      return rate;
    }
  } catch (error) {
    console.error("Exchange rate API error:", error);
  }
  return 7.2; // 默认汇率
}

// ============ 清理过期帖子相关 ============

async function cleanupExpiredPosts(env) {
  console.log("Cron triggered: Cleaning up expired posts...");

  try {
    // 查询过期帖子
    const query = `
      SELECT id, expires_at
      FROM posts
      WHERE expires_at IS NOT NULL
        AND expires_at <= datetime('now')
        AND status != 'expired'
      LIMIT 100
    `;

    const result = await env.DB.prepare(query).all();

    if (!result.results || result.results.length === 0) {
      console.log("No expired posts found");
      return;
    }

    console.log(`Found ${result.results.length} expired posts`);

    // 标记为过期
    const postIds = result.results.map(row => row.id);
    await deletePosts(env, postIds);

    console.log(`Cleanup completed: ${postIds.length} posts marked as expired`);
  } catch (error) {
    console.error("Failed to cleanup expired posts:", error);
  }
}

async function deletePosts(env, postIds) {
  if (postIds.length === 0) return 0;

  try {
    const placeholders = postIds.map(() => "?").join(",");
    const query = `
      UPDATE posts
      SET status = 'expired', updated_at = datetime('now')
      WHERE id IN (${placeholders})
    `;

    const stmt = env.DB.prepare(query);
    const result = await stmt.bind(...postIds).run();

    return result.meta?.last_row_id || postIds.length;
  } catch (error) {
    console.error("Failed to mark posts as expired:", error);
    return 0;
  }
}
