export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";
import { hashPassword, signToken } from "@/lib/auth";
import type { UserPublic } from "@/types";

const registerSchema = z.object({
  username: z.string().min(2, "用户名至少2个字符").max(20, "用户名最多20个字符"),
  email: z.string().email("请输入有效的邮箱"),
  password: z.string().min(6, "密码至少6个字符").max(50, "密码最多50个字符"),
});

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "参数验证失败" },
        { status: 400 }
      );
    }

    const { username, email, password } = result.data;
    const db = (request as any).env?.DB;

    if (!db) {
      console.error("DB binding not found");
      return NextResponse.json(
        { error: "数据库连接失败" },
        { status: 500 }
      );
    }

    const existingUser = await db
      .prepare("SELECT id FROM users WHERE email = ? OR username = ?")
      .bind(email, username)
      .first();

    if (existingUser) {
      return NextResponse.json(
        { error: "邮箱或用户名已被注册" },
        { status: 409 }
      );
    }

    const id = generateUUID();
    const passwordHash = await hashPassword(password);

    await db
      .prepare(
        `INSERT INTO users (id, username, email, password_hash, role, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'user', datetime('now'), datetime('now'))`
      )
      .bind(id, username, email, passwordHash)
      .run();

    const token = await signToken({ userId: id, email, role: "user" });

    const user: UserPublic = {
      id,
      username,
      email,
      role: "user",
      created_at: new Date().toISOString(),
    };

    const response = NextResponse.json({ data: user }, { status: 201 });
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 604800,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "注册失败，请稍后重试" },
      { status: 500 }
    );
  }
}
