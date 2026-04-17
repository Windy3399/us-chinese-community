import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getDB } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // 1. 验证登录
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "登录已过期" }, { status: 401 });
    }

    const userId = decoded.userId;
    const db = getDB({ env: (request as any).env });

    // 获取用户的所有帖子
    const query = `
      SELECT
        p.id,
        p.title,
        p.status,
        p.view_count,
        p.created_at,
        p.expires_at,
        c.name as category_name,
        c.slug as category_slug
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `;

    const posts = await db.prepare(query).bind(userId).all();

    return NextResponse.json({ data: posts.results });
  } catch (error) {
    console.error("Failed to fetch user posts:", error);
    return NextResponse.json(
      { error: "获取帖子失败" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 1. 验证登录
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "登录已过期" }, { status: 401 });
    }

    const userId = decoded.userId;
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("id");

    if (!postId) {
      return NextResponse.json({ error: "帖子ID不能为空" }, { status: 400 });
    }

    const db = getDB({ env: (request as any).env });

    // 验证帖子属于当前用户
    const post = await db.prepare("SELECT id FROM posts WHERE id = ? AND user_id = ?").bind(postId, userId).first();

    if (!post) {
      return NextResponse.json({ error: "帖子不存在或无权删除" }, { status: 404 });
    }

    // 删除帖子（关联的评论和图片会通过 CASCADE 自动删除）
    await db.prepare("DELETE FROM posts WHERE id = ?").bind(postId).run();

    return NextResponse.json({ message: "删除成功" });
  } catch (error) {
    console.error("Failed to delete post:", error);
    return NextResponse.json(
      { error: "删除失败" },
      { status: 500 }
    );
  }
}
