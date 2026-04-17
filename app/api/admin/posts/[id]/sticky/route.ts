import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export const runtime = 'edge';

// PATCH /api/admin/posts/[id]/sticky — 设置帖子置顶
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
    const { is_sticky, sticky_order } = body;

    if (typeof is_sticky !== 'number') {
      return NextResponse.json({ error: "缺少 is_sticky 参数" }, { status: 400 });
    }

    // 更新置顶状态和排序
    await db
      .prepare(`
        UPDATE posts 
        SET is_sticky = ?, sticky_order = ?, updated_at = datetime('now')
        WHERE id = ?
      `)
      .bind(is_sticky, sticky_order || 0, id)
      .run();

    return NextResponse.json({
      success: true,
      message: is_sticky === 1 ? "已设为置顶" : "已取消置顶",
    });
  } catch (error) {
    console.error("Sticky post error:", error);
    return NextResponse.json({ error: "置顶操作失败" }, { status: 500 });
  }
}