"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Post Card Skeleton - 用于帖子列表加载状态
 */
export function PostCardSkeleton() {
  return (
    <div className="flex gap-4 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
      <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 animate-pulse" />
      <div className="flex-1 space-y-3 py-1">
        <div className="h-5 w-3/4 bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 rounded animate-pulse" />
        <div className="h-5 w-1/2 bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 rounded-full animate-pulse" />
          <div className="h-5 w-20 bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/**
 * Post Detail Skeleton - 用于帖子详情页加载状态
 */
export function PostDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>

      {/* Image Skeleton */}
      <Skeleton className="w-full h-64 rounded-lg" />

      {/* Content Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Actions Skeleton */}
      <div className="flex gap-3 pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

/**
 * List Skeleton - 用于通用列表加载状态
 */
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-3/4 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * Search Result Skeleton - 搜索结果加载状态
 */
export function SearchResultSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
          <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 animate-pulse" />
          <div className="flex-1 space-y-3 py-1">
            <div className="h-5 w-3/4 bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 rounded animate-pulse" />
            <div className="h-4 w-full bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 rounded animate-pulse" />
            <div className="flex gap-2">
              <div className="h-5 w-16 bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 rounded-full animate-pulse" />
              <div className="h-5 w-20 bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
