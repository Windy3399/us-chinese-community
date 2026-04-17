import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "@/lib/auth";
import type { D1Database } from "@cloudflare/workers-types";

function getDB(request: Request): D1Database {
  const env = (request as any).env;
  if (!env?.DB) {
    throw new Error("D1 database binding not found");
  }
  return env.DB;
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "未登录" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: "登录已过期" },
        { status: 401 }
      );
    }

    const db = getDB(request);
    const user = await db
      .prepare("SELECT id, username, email, role, created_at FROM users WHERE id = ?")
      .bind(payload.userId)
      .first();

    if (!user) {
      return NextResponse.json(
        { error: "用户不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "获取用户信息失败" },
      { status: 500 }
    );
  }
}
