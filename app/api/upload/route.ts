import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import type { R2Bucket } from "@cloudflare/workers-types";

export const runtime = 'edge';

function generateId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: NextRequest) {
  try {
    // 1. 验证登录
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "登录已过期" }, { status: 401 });
    }

    const userId = decoded.userId;

    // 2. 获取 R2 binding
    const R2 = (request as any).env?.R2 as R2Bucket | undefined;
    if (!R2) {
      console.error("R2 binding not found");
      return NextResponse.json({ error: "存储服务未配置" }, { status: 500 });
    }

    // 3. 获取 FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "未上传文件" }, { status: 400 });
    }

    // 4. 验证类型
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "不支持的文件类型，请上传 JPEG/PNG/WEBP" },
        { status: 400 }
      );
    }

    // 5. 验证大小 (≤5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "文件大小不能超过 5MB" },
        { status: 400 }
      );
    }

    // 6. 生成路径
    const timestamp = Date.now();
    const uuid = generateId();
    const filename = `${timestamp}-${uuid}.webp`;
    const key = `images/${userId}/${filename}`;

    // 7. 写入 R2
    const fileBuffer = await file.arrayBuffer();
    await R2.put(key, fileBuffer, {
      httpMetadata: {
        contentType: "image/webp",
      },
      customMetadata: {
        uploadedBy: userId,
        originalType: file.type,
      },
    });

    // 8. 返回公开 URL
    // R2.dev 公开访问: https://{account}.{subdomain}.r2.dev/{key}
    // 或自定义域名配置
    const r2Domain = (request as any).env?.R2_PUBLIC_URL || `https://r2.dev`;
    const publicUrl = `${r2Domain}/${key}`;

    return NextResponse.json({
      data: {
        url: publicUrl,
        key,
        filename,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "上传失败，请稍后重试" }, { status: 500 });
  }
}
