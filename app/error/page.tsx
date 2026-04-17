"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Error Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            出错了
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            抱歉，页面加载时发生了错误。请稍后重试。
          </p>
        </div>

        {/* Error Details (Dev Only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-left">
            <p className="text-sm font-mono text-red-600 dark:text-red-400 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-zinc-500 mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button size="lg" onClick={reset} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            重试
          </Button>
          <Link href="/">
            <Button size="lg" variant="outline">
              返回首页
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
