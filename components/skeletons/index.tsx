"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function PostCardSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 p-5 space-y-3">
      <div className="flex items-start justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-5 w-1/2" />
      <div className="flex items-center gap-3 pt-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

export function PostDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Back button */}
      <Skeleton className="h-5 w-24" />

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Sticky badge */}
          <Skeleton className="h-6 w-28" />

          {/* Title */}
          <Skeleton className="h-8 w-full max-w-2xl" />

          {/* Meta */}
          <div className="flex gap-3">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Images */}
          <Skeleton className="h-80 w-full rounded-xl" />

          {/* Content */}
          <Skeleton className="h-40 w-full" />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function SearchResultSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 p-6 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MyPostsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 p-6 space-y-3">
          <div className="flex items-start justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex items-center gap-4 pt-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="py-16 md:py-24">
        <Skeleton className="h-12 w-80 mx-auto mb-4" />
        <Skeleton className="h-8 w-96 mx-auto mb-6" />
        <Skeleton className="h-5 w-full max-w-2xl mx-auto" />
        <Skeleton className="h-5 w-3/4 max-w-xl mx-auto" />
      </div>

      {/* Categories */}
      <div>
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>

      {/* Latest posts */}
      <div>
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
