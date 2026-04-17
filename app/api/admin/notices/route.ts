import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export const runtime = 'edge';

// GET /api/admin/notices — 获取公告列表
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

    const notices = await db
      .prepare(`
        SELECT * FROM notices ORDER BY created_at DESC
      `)
      .all();

    return NextResponse.json({
      success: true,
      data: {
        notices: notices.results || [],
      },
    });
  } catch (error) {
    console.error("Admin GET notices error:", error);
    return NextResponse.json({ error: "获取公告列表失败" }, { status: 500 });
  }
}

// POST /api/admin/notices — 创建公告
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
    const { title, content, is_active = 1 } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "标题和内容不能为空" }, { status: 400 });
    }

    await db
      .prepare(`
        INSERT INTO notices (title, content, is_active, created_at)
        VALUES (?, ?, ?, datetime('now'))
      `)
      .bind(title, content, is_active)
      .run();

    return NextResponse.json({
      success: true,
      message: "公告发布成功",
    });
  } catch (error) {
    console.error("Admin POST notice error:", error);
    return NextResponse.json({ error: "发布公告失败" }, { status: 500 });
  }
}

// PUT /api/admin/notices — 更新公告状态
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
      return NextResponse.json({ error: "缺少公告ID" }, { status: 400 });
    }

    await db
      .prepare("UPDATE notices SET is_active = ? WHERE id = ?")
      .bind(is_active, id)
      .run();

    return NextResponse.json({
      success: true,
      message: "公告状态更新成功",
    });
  } catch (error) {
    console.error("Admin PUT notice error:", error);
    return NextResponse.json({ error: "更新公告失败" }, { status: 500 });
  }
}

// DELETE /api/admin/notices — 删除公告
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
      return NextResponse.json({ error: "缺少公告ID" }, { status: 400 });
    }

    await db.prepare("DELETE FROM notices WHERE id = ?").bind(id).run();

    return NextResponse.json({
      success: true,
      message: "公告删除成功",
    });
  } catch (error) {
    console.error("Admin DELETE notice error:", error);
    return NextResponse.json({ error: "删除公告失败" }, { status: 500 });
  }
}