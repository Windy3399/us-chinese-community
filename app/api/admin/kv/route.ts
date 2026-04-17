import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export const runtime = 'edge';

// GET /api/admin/kv — 获取KV配置
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: "无权限访问" }, { status: 403 });
    }

    const db = (request as any).env?.DB;

    // 获取公告
    const announcementResult = await db
      .prepare("SELECT value FROM kv_store WHERE key = 'site_announcement'")
      .first();

    const announcement = announcementResult?.value
      ? JSON.parse(announcementResult.value)
      : { enabled: false, content: "", style: "info" };

    // 获取广告（全局和按分类）
    const adsResult = await db
      .prepare("SELECT key, value FROM kv_store WHERE key LIKE 'ads_%'")
      .all();

    const ads: Record<string, any> = {};
    for (const row of adsResult.results || []) {
      try {
        ads[row.key] = JSON.parse(row.value);
      } catch {
        ads[row.key] = row.value;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        announcement,
        ads,
      },
    });
  } catch (error) {
    console.error("Get KV error:", error);
    return NextResponse.json({ error: "获取配置失败" }, { status: 500 });
  }
}

// PUT /api/admin/kv — 更新KV配置
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: "无权限访问" }, { status: 403 });
    }

    const db = (request as any).env?.DB;
    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json({ error: "缺少key参数" }, { status: 400 });
    }

    // 使用 UPSERT 语法（D1 支持）
    await db
      .prepare(`
        INSERT INTO kv_store (key, value, updated_at)
        VALUES (?, ?, datetime('now'))
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
      `)
      .bind(key, JSON.stringify(value))
      .run();

    return NextResponse.json({
      success: true,
      message: "配置已保存",
    });
  } catch (error) {
    console.error("Put KV error:", error);
    return NextResponse.json({ error: "保存配置失败" }, { status: 500 });
  }
}