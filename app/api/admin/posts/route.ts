import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export const runtime = 'edge';

// GET /api/admin/posts — 获取帖子列表（管理员视图）
export async function GET(request: NextRequest) {
  try {
    const db = (request as any).env?.DB;
    if (!db) {
      return NextResponse.json({ error: "数据库连接失败" }, { status: 500 });
    }

    // 验证管理员权限
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: "无权限访问" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const offset = (page - 1) * limit;
    const status = searchParams.get("status");

    // 构建查询条件
    let whereClause = "1=1";
    let bindings: (string | number)[] = [];

    if (status) {
      whereClause += " AND p.status = ?";
      bindings.push(status);
    }

    // 获取总数
    const countResult = await db
      .prepare(`
        SELECT COUNT(*) as total FROM posts p WHERE ${whereClause}
      `)
      .bind(...bindings)
      .first();

    const total = countResult?.total || 0;

    // 获取帖子列表（包含用户和分类信息）
    const posts = await db
      .prepare(`
        SELECT 
          p.id,
          p.title,
          p.description,
          p.state,
          p.city,
          p.status,
          p.is_sticky,
          p.sticky_order,
          p.view_count,
          p.created_at,
          p.updated_at,
          u.username,
          c.name as category_name
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE ${whereClause}
        ORDER BY p.is_sticky DESC, p.sticky_order ASC, p.created_at DESC
        LIMIT ? OFFSET ?
      `)
      .bind(...bindings, limit, offset)
      .all();

    return NextResponse.json({
      success: true,
      data: {
        posts: posts.results || [],
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    console.error("Admin GET posts error:", error);
    return NextResponse.json({ error: "获取帖子列表失败" }, { status: 500 });
  }
}