import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export const runtime = 'edge';

// GET /api/admin/ads — 获取广告列表
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

    const ads = await db
      .prepare(`
        SELECT 
          a.id, a.title, a.position, a.image_url, a.link_url, a.is_active, a.is_global, a.priority, a.created_at,
          c.name as category_name
        FROM ads a
        LEFT JOIN categories c ON a.category_id = c.id
        ORDER BY a.priority DESC, a.created_at DESC
      `)
      .all();

    return NextResponse.json({
      success: true,
      data: {
        ads: ads.results || [],
      },
    });
  } catch (error) {
    console.error("Admin GET ads error:", error);
    return NextResponse.json({ error: "获取广告列表失败" }, { status: 500 });
  }
}

// POST /api/admin/ads — 创建广告
export async function POST(request: NextRequest) {
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
    const { title, position, image_url, link_url, is_active = 1, category_id } = body;

    if (!image_url) {
      return NextResponse.json({ error: "图片URL不能为空" }, { status: 400 });
    }

    await db
      .prepare(`
        INSERT INTO ads (title, position, image_url, link_url, is_active, category_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `)
      .bind(title || "", position || "homepage_top", image_url, link_url || "", is_active, category_id || null)
      .run();

    return NextResponse.json({
      success: true,
      message: "广告添加成功",
    });
  } catch (error) {
    console.error("Admin POST ad error:", error);
    return NextResponse.json({ error: "添加广告失败" }, { status: 500 });
  }
}

// PUT /api/admin/ads — 更新广告状态
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
    const { id, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: "缺少广告ID" }, { status: 400 });
    }

    await db
      .prepare("UPDATE ads SET is_active = ? WHERE id = ?")
      .bind(is_active, id)
      .run();

    return NextResponse.json({
      success: true,
      message: "广告状态更新成功",
    });
  } catch (error) {
    console.error("Admin PUT ad error:", error);
    return NextResponse.json({ error: "更新广告失败" }, { status: 500 });
  }
}

// DELETE /api/admin/ads — 删除广告
export async function DELETE(request: NextRequest) {
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
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "缺少广告ID" }, { status: 400 });
    }

    await db.prepare("DELETE FROM ads WHERE id = ?").bind(id).run();

    return NextResponse.json({
      success: true,
      message: "广告删除成功",
    });
  } catch (error) {
    console.error("Admin DELETE ad error:", error);
    return NextResponse.json({ error: "删除广告失败" }, { status: 500 });
  }
}