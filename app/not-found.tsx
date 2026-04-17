"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  useEffect(() => {
    console.error("404 Not Found: Page does not exist");
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md px-4">
        {/* 404 Icon */}
        <div className="relative">
          <div className="text-9xl font-bold text-zinc-200 dark:text-zinc-800 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertCircle className="w-24 h-24 text-zinc-400" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            页面未找到
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            抱歉，您访问的页面不存在或已被移除
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link href="/">
            <Button size="lg" className="gap-2">
              <Home className="w-4 h-4" />
              返回首页
            </Button>
          </Link>
          <Link href="/search">
            <Button size="lg" variant="outline" className="gap-2">
              <Search className="w-4 h-4" />
              搜索帖子
            </Button>
          </Link>
        </div>

        {/* Help Links */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-sm text-zinc-500 mb-3">您可能想要：</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/category/local-news">
              <Button variant="ghost" size="sm">浏览本土资讯</Button>
            </Link>
            <Link href="/publish">
              <Button variant="ghost" size="sm">发布帖子</Button>
            </Link>
            <Link href="/my-posts">
              <Button variant="ghost" size="sm">查看我的帖子</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
