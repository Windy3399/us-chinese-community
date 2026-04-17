import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export const runtime = 'edge';

// GET /api/admin/stats — 获取统计数据
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

    // 总帖子数
    const totalPostsResult = await db.prepare("SELECT COUNT(*) as count FROM posts").first();
    const totalPosts = totalPostsResult?.count || 0;

    // 待审核帖子数
    const pendingPostsResult = await db.prepare("SELECT COUNT(*) as count FROM posts WHERE status = 'pending'").first();
    const pendingPosts = pendingPostsResult?.count || 0;

    // 今日新增帖子数
    const today = new Date().toISOString().split("T")[0];
    const todayPostsResult = await db
      .prepare("SELECT COUNT(*) as count FROM posts WHERE date(created_at) = date(?)")
      .bind(today)
      .first();
    const todayPosts = todayPostsResult?.count || 0;

    // 用户总数
    const totalUsersResult = await db.prepare("SELECT COUNT(*) as count FROM users").first();
    const totalUsers = totalUsersResult?.count || 0;

    return NextResponse.json({
      success: true,
      data: {
        totalPosts,
        pendingPosts,
        todayPosts,
        totalUsers,
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "获取统计数据失败" }, { status: 500 });
  }
}