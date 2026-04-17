import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const db = getDB({ env: (request as any).env });
    const { getCategories } = await import("@/lib/db");
    const categories = await getCategories(db);
    return NextResponse.json({ data: categories });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json(
      { error: "获取分类失败" },
      { status: 500 }
    );
  }
}
