import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

// GET /api/ads — 获取当前分类或全局广告
export async function GET(request: NextRequest) {
  try {
    const db = (request as any).env?.DB;
    if (!db) {
      return NextResponse.json({ error: "数据库连接失败" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    let query = `
      SELECT 
        a.id, a.title, a.position, a.image_url, a.link_url, a.priority,
        c.name as category_name
      FROM ads a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.is_active = 1
    `;

    const bindings: (string | number)[] = [];

    if (categoryId) {
      query += " AND (a.is_global = 1 OR a.category_id = ?)";
      bindings.push(parseInt(categoryId, 10));
    } else {
      query += " AND a.is_global = 1";
    }

    query += " ORDER BY a.priority DESC, a.created_at DESC";

    const ads = await db.prepare(query).bind(...bindings).all();

    return NextResponse.json({
      success: true,
      data: {
        ads: ads.results || [],
      },
    });
  } catch (error) {
    console.error("Get ads error:", error);
    return NextResponse.json({ error: "获取广告失败" }, { status: 500 });
  }
}