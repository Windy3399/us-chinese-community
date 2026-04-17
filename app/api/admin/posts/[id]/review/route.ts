import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export const runtime = 'edge';

// PATCH /api/admin/posts/[id]/review — 审核帖子
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "无效的操作" }, { status: 400 });
    }

    const newStatus = action === "approve" ? "active" : "rejected";

    // 更新帖子状态
    const result = await db
      .prepare("UPDATE posts SET status = ?, updated_at = datetime('now') WHERE id = ?")
      .bind(newStatus, id)
      .run();

    if (result.changes === 0) {
      return NextResponse.json({ error: "帖子不存在" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: action === "approve" ? "帖子已通过审核" : "帖子已拒绝",
    });
  } catch (error) {
    console.error("Review post error:", error);
    return NextResponse.json({ error: "审核操作失败" }, { status: 500 });
  }
}