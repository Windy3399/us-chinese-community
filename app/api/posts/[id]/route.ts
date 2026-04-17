import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = (request as any).env?.DB;

    if (!db) {
      console.error("DB binding not found");
      return NextResponse.json(
        { error: "数据库连接失败" },
        { status: 500 }
      );
    }

    // Get post with related data
    const post = await db
      .prepare(`
        SELECT 
          p.id,
          p.user_id,
          p.category_id,
          p.title,
          p.description,
          p.state,
          p.city,
          p.phone,
          p.wechat,
          p.status,
          p.is_sticky,
          p.sticky_order,
          p.view_count,
          p.extra_fields,
          p.created_at,
          p.updated_at,
          u.id as user_id,
          u.username,
          c.name as category_name,
          c.slug as category_slug
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
          AND p.status = 'active'
          AND (p.expires_at IS NULL OR p.expires_at > datetime('now'))
      `)
      .bind(id)
      .first();

    if (!post) {
      return NextResponse.json(
        { error: "帖子不存在或已下架" },
        { status: 404 }
      );
    }

    // Get post images
    const images = await db
      .prepare(`
        SELECT id, image_url, sort_order
        FROM post_images
        WHERE post_id = ?
        ORDER BY sort_order ASC
      `)
      .bind(id)
      .all();

    // Increment view count
    await db
      .prepare(`
        UPDATE posts SET view_count = view_count + 1 WHERE id = ?
      `)
      .bind(id)
      .run();

    return NextResponse.json({
      data: {
        ...post,
        images: images.results || [],
      },
    });
  } catch (error) {
    console.error("Get post error:", error);
    return NextResponse.json(
      { error: "获取帖子详情失败" },
      { status: 500 }
    );
  }
}
