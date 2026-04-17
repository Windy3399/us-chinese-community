import { NextResponse } from "next/server";

export default async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://your-domain.com";

  // 静态页面
  const staticPages = [
    { url: "/", priority: 1.0, changefreq: "daily" },
    { url: "/search", priority: 0.8, changefreq: "daily" },
    { url: "/my-posts", priority: 0.7, changefreq: "weekly" },
    { url: "/publish", priority: 0.7, changefreq: "weekly" },
  ];

  // 从数据库获取动态页面 - 分类页面
  const categoryPaths = [
    "local-news", "chinese-community", "jobs", "housing",
    "marketplace", "welfare", "recommendations", "deals", "yellow-pages", "others"
  ];

  // 构建 sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join("")}
  ${categoryPaths
    .map(
      (slug) => `
  <url>
    <loc>${baseUrl}/category/${slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join("")}
</urlset>`.trim();

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "max-age=3600, s-maxage=86400",
    },
  });
}
