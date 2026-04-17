import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { verifyToken } from "@/lib/auth";

const PUBLIC = ["/", "/login", "/register", "/api/auth"];
const AUTH_REQUIRED = ["/category", "/post", "/publish", "/my-posts", "/search"];
const ADMIN = ["/portal_v2_xyz", "/admin"];

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-in-production"
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 检查管理后台路径
  if (ADMIN.some((path) => pathname.startsWith(path))) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      const redirectUrl = new URL("/login", request.url);
      return NextResponse.redirect(redirectUrl);
    }

    const decoded = await verifyToken(token);

    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "无权限访问" }, { status: 404 });
    }
  } else if (AUTH_REQUIRED.some((path) => pathname.startsWith(path))) {
    // 用户认证路径
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    const decoded = await verifyToken(token);

    if (!decoded) {
      const redirectUrl = new URL("/login", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
