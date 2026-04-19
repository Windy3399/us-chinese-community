import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";

export const runtime = 'edge';

const createCommentSchema = z.object({
  content: z.string().min(1, "请输入评论内容").max(500, "评论最多500个字符"),
});

function generateId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

// 敏感词过滤（预留）
function filterContent(content: string): string {
  // TODO: 实现敏感词过滤
  return content;
}

export async function GET(request: NextRequest) {
  try {
    const db = (request as any).env?.DB;
    if (!db) {
      return NextResponse.json({ error: "数据库连接失败" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const offset = (page - 1) * limit;

    if (!postId) {
      return NextResponse.json({ error: "缺少帖子ID" }, { status: 400 });
    }

    // 获取评论总数
    const countResult = await db
      .prepare("SELECT COUNT(*) as total FROM comments WHERE post_id = ?")
      .bind(postId)
      .first();

    const total = countResult?.total || 0;
    const totalPages = Math.ceil(total / limit);

    // 获取评论列表（联表用户名，时间倒序）
    const comments = await db
      .prepare(`
        SELECT 
          c.id,
          c.post_id,
          c.user_id,
          c.content,
          c.created_at,
          u.username
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.post_id = ?
        ORDER BY c.created_at DESC
        LIMIT ? OFFSET ?
      `)
      .bind(postId, limit, offset)
      .all();

    return NextResponse.json({
      data: {
        comments: comments.results || [],
        total,
        page,
        totalPages,
        limit,
      },
    });
  } catch (error) {
    console.error("Get comments error:", error);
    return NextResponse.json({ error: "获取评论失败" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = (request as any).env?.DB;
    if (!db) {
      return NextResponse.json({ error: "数据库连接失败" }, { status: 500 });
    }

    // 验证登录
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "登录已过期" }, { status: 401 });
    }

    const userId = decoded.userId;

    // Zod 验证
    const body = await request.json();
    const validationResult = createCommentSchema.safeParse(body);

    if (!validationResult.success) {
      const error = validationResult.error;
      const errorMessage = error.issues?.[0]?.message || "数据验证失败";
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    const { content, postId } = { ...body, ...validationResult.data };

    if (!postId) {
      return NextResponse.json({ error: "缺少帖子ID" }, { status: 400 });
    }

    // 评论限制：普通用户5分钟内最多发10条
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      .toISOString()
      .replace("T", " ")
      .split(".")[0];

    const userResult = await db
      .prepare("SELECT daily_comment_count, last_comment_date, role, is_unlimited FROM users WHERE id = ?")
      .bind(userId)
      .first();

    if (!userResult) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 管理员和无限用户不受限制
    if (userResult.role !== 'admin' && userResult.is_unlimited !== 1) {
      const recentCount = await db
        .prepare(`
          SELECT COUNT(*) as count 
          FROM comments 
          WHERE user_id = ? AND created_at > ?
        `)
        .bind(userId, fiveMinutesAgo)
        .first();

      if (recentCount && recentCount.count >= 10) {
        return NextResponse.json(
          { error: "评论过于频繁，请在5分钟后继续" },
          { status: 429 }
        );
      }
    }

    // 过滤敏感词
    const filteredContent = filterContent(content);

    // 插入评论
    const commentId = generateId();
    const now = new Date().toISOString().replace("T", " ").split(".")[0];

    await db
      .prepare(`
        INSERT INTO comments (id, post_id, user_id, content, created_at)
        VALUES (?, ?, ?, ?, ?)
      `)
      .bind(commentId, postId, userId, filteredContent, now)
      .run();

    // 更新用户每日评论计数（非管理员和无限用户）
    if (userResult.role !== 'admin' && userResult.is_unlimited !== 1) {
      const today = new Date().toISOString().split("T")[0];
      const shouldReset = userResult.last_comment_date !== today;
      const newCount = shouldReset ? 1 : (userResult.daily_comment_count || 0) + 1;
      await db
        .prepare("UPDATE users SET daily_comment_count = ?, last_comment_date = ? WHERE id = ?")
        .bind(newCount, today, userId)
        .run();
    }

    // 获取用户名
    const user = await db
      .prepare("SELECT username FROM users WHERE id = ?")
      .bind(userId)
      .first();

    return NextResponse.json({
      data: {
        id: commentId,
        post_id: postId,
        user_id: userId,
        content: filteredContent,
        created_at: now,
        username: user?.username || "匿名用户",
      },
      message: "评论成功",
    });
  } catch (error) {
    console.error("Create comment error:", error);
    return NextResponse.json({ error: "评论失败，请稍后重试" }, { status: 500 });
  }
}
