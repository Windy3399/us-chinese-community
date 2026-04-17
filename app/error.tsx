"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md px-4">
        {/* Error Icon */}
        <div className="relative">
          <div className="text-9xl font-bold text-red-200 dark:text-red-900/30 select-none">
            !
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertTriangle className="w-24 h-24 text-red-500" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            出错了
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            抱歉，页面加载时发生了错误
          </p>
          {error.message && (
            <p className="text-sm text-red-600 dark:text-red-400 font-mono bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              {error.message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button size="lg" onClick={reset} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            重试
          </Button>
          <Link href="/">
            <Button size="lg" variant="outline" className="gap-2">
              <Home className="w-4 h-4" />
              返回首页
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-sm text-zinc-500">
            如果问题持续存在，请刷新页面或稍后重试
          </p>
        </div>
      </div>
    </div>
  );
}
