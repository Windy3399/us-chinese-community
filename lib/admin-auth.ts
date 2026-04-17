import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return { error: "请先登录", status: 401 };
  }

  const decoded = await verifyToken(token);

  if (!decoded) {
    return { error: "登录已过期", status: 401 };
  }

  if (decoded.role !== "admin") {
    return { error: "无管理员权限", status: 403 };
  }

  return { user: decoded, error: null };
}

export function getDB(request: NextRequest) {
  const db = (request as any).env?.DB;
  if (!db) {
    throw new Error("数据库连接失败");
  }
  return db;
}