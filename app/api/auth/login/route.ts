import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";
import { verifyPassword, signToken } from "@/lib/auth";
import type { D1Database } from "@cloudflare/workers-types";

const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱"),
  password: z.string().min(1, "请输入密码"),
});

function getDB(request: Request): D1Database {
  const env = (request as any).env;
  if (!env?.DB) {
    throw new Error("D1 database binding not found");
  }
  return env.DB;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "请提供有效的邮箱和密码" },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const db = getDB(request);

    const user = await db
      .prepare("SELECT * FROM users WHERE email = ?")
      .bind(email)
      .first();

    if (!user) {
      return NextResponse.json(
        { error: "邮箱或密码错误" },
        { status: 401 }
      );
    }

    if ((user as any).is_banned === 1) {
      return NextResponse.json(
        { error: "账号已被禁用" },
        { status: 403 }
      );
    }

    const isValid = await verifyPassword(password, (user as any).password_hash);

    if (!isValid) {
      return NextResponse.json(
        { error: "邮箱或密码错误" },
        { status: 401 }
      );
    }

    const token = await signToken({
      userId: (user as any).id,
      email: (user as any).email,
      role: (user as any).role,
      isUnlimited: (user as any).is_unlimited || 0,
    });

    const response = NextResponse.json({
      data: {
        id: (user as any).id,
        username: (user as any).username,
        email: (user as any).email,
        role: (user as any).role,
        isUnlimited: (user as any).is_unlimited || 0,
      },
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 604800,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "登录失败，请稍后重试" },
      { status: 500 }
    );
  }
}
