import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export const runtime = 'edge';

// GET /api/admin/users — 获取用户列表
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

    const countResult = await db.prepare("SELECT COUNT(*) as total FROM users").first();
    const total = countResult?.total || 0;

    const users = await db
      .prepare(`
        SELECT 
          id, username, email, role, is_banned, is_unlimited,
          daily_post_count, last_post_date, daily_comment_count, last_comment_date, created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `)
      .bind(limit, offset)
      .all();

    return NextResponse.json({
      success: true,
      data: {
        users: users.results || [],
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    console.error("Admin GET users error:", error);
    return NextResponse.json({ error: "获取用户列表失败" }, { status: 500 });
  }
}

// PUT /api/admin/users — 更新用户状态
export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { userId, isBanned, isUnlimited, role } = body;

    if (!userId) {
      return NextResponse.json({ error: "缺少用户ID" }, { status: 400 });
    }

    // 检查用户是否存在
    const user = await db.prepare("SELECT id FROM users WHERE id = ?").bind(userId).first();
    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 构建更新语句
    const updates: string[] = [];
    const bindings: (string | number)[] = [];

    if (typeof isBanned === 'number') {
      updates.push("is_banned = ?");
      bindings.push(isBanned === 1 ? 1 : 0);
    }

    if (typeof isUnlimited === 'number') {
      updates.push("is_unlimited = ?");
      bindings.push(isUnlimited === 1 ? 1 : 0);
    }

    if (typeof role === 'string' && (role === 'admin' || role === 'user')) {
      updates.push("role = ?");
      bindings.push(role);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "没有需要更新的字段" }, { status: 400 });
    }

    bindings.push(userId);

    await db
      .prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`)
      .bind(...bindings)
      .run();

    return NextResponse.json({
      success: true,
      message: "用户状态更新成功",
    });
  } catch (error) {
    console.error("Admin update user error:", error);
    return NextResponse.json({ error: "更新用户状态失败" }, { status: 500 });
  }
}