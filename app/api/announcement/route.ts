import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // 开发环境：返回模拟公告
    if (process.env.NODE_ENV === 'development' || !request.headers.get('cf-env')) {
      return NextResponse.json({
        success: true,
        data: {
          enabled: true,
          content: "欢迎来到美国华人同城！请注意辨别信息真伪，谨防诈骗。",
          style: "info"
        }
      });
    }

    // 生产环境：从数据库读取
    const db = (request as any).env?.DB;
    if (!db) {
      return NextResponse.json({ error: "数据库连接失败" }, { status: 500 });
    }

    const result = await db
      .prepare("SELECT value FROM kv_store WHERE key = 'site_announcement'")
      .first();

    const announcement = result?.value
      ? JSON.parse(result.value)
      : { enabled: false, content: "", style: "info" };

    return NextResponse.json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    console.error("Get announcement error:", error);

    // 开发环境降级
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        success: true,
        data: {
          enabled: false,
          content: "",
          style: "info"
        }
      });
    }

    return NextResponse.json({ error: "获取公告失败" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // 仅允许管理员更新公告（这里简化处理，实际应验证身份）
    const body = await request.json();
    const { content, style = "info", enabled = true } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: "公告内容不能为空" },
        { status: 400 }
      );
    }

    const announcement = { enabled, content, style };

    // 开发环境：仅返回成功
    if (process.env.NODE_ENV === 'development' || !request.headers.get('cf-env')) {
      return NextResponse.json({
        success: true,
        data: announcement
      });
    }

    // 生产环境：保存到数据库
    const db = (request as any).env?.DB;
    if (!db) {
      return NextResponse.json({ error: "数据库连接失败" }, { status: 500 });
    }

    await db
      .prepare("INSERT OR REPLACE INTO kv_store (key, value, updated_at) VALUES (?, ?, datetime('now'))")
      .bind("site_announcement", JSON.stringify(announcement))
      .run();

    return NextResponse.json({
      success: true,
      data: announcement
    });
  } catch (error) {
    console.error("Update announcement error:", error);

    // 开发环境降级
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        success: true,
        data: { enabled: true, content: "公告已更新", style: "info" }
      });
    }

    return NextResponse.json({ error: "更新公告失败" }, { status: 500 });
  }
}
