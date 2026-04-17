import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* 404 Number */}
        <div className="relative">
          <h1 className="text-9xl font-bold text-zinc-100 dark:text-zinc-900 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-24 h-24 text-blue-500 opacity-20" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            页面未找到
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            抱歉，您访问的页面不存在或已被移除
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
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
          <Button
            size="lg"
            variant="ghost"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回上页
          </Button>
        </div>

        {/* Suggestions */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-sm text-zinc-500 mb-3">您可能想找：</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["🏠 房屋租售", "💼 招聘求职", "🛒 同城交易", "📰 本地资讯"].map((item) => (
              <Link key={item} href="/">
                <span className="px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer">
                  {item}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
