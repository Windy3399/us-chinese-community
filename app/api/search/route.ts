import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const categoryId = searchParams.get("categoryId");
    const state = searchParams.get("state");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const offset = (page - 1) * limit;

    if (!q) {
      return NextResponse.json(
        { error: "搜索关键词不能为空" },
        { status: 400 }
      );
    }

    const db = getDB({ env: (request as any).env });

    // 构建搜索查询 - 在标题、描述中搜索
    let query = `
      SELECT
        p.id,
        p.title,
        p.description,
        p.state,
        p.city,
        p.status,
        p.view_count,
        p.created_at,
        c.name as category_name,
        c.slug as category_slug
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'active'
        AND (p.title LIKE ? OR p.description LIKE ?)
    `;

    const bindings: (string | number)[] = [`%${q}%`, `%${q}%`];

    if (categoryId) {
      query += " AND p.category_id = ?";
      bindings.push(parseInt(categoryId, 10));
    }

    if (state) {
      query += " AND p.state = ?";
      bindings.push(state);
    }

    // 获取总数
    const countQuery = `SELECT COUNT(*) as total FROM posts p WHERE p.status = 'active' AND (p.title LIKE ? OR p.description LIKE ?)`;
    const countBindings: (string | number)[] = [`%${q}%`, `%${q}%`];
    if (categoryId) countBindings.push(parseInt(categoryId, 10));
    if (state) countBindings.push(state);

    const countResult = await db.prepare(countQuery).bind(...countBindings).first();
    const total = Number(countResult?.total || 0);

    // 添加排序和分页
    query += " ORDER BY p.is_sticky DESC, p.created_at DESC LIMIT ? OFFSET ?";
    bindings.push(limit, offset);

    const posts = await db.prepare(query).bind(...bindings).all();

    return NextResponse.json({
      data: posts.results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "搜索失败" },
      { status: 500 }
    );
  }
}
