"use client";

import Link from "next/link";
import { MapPin, Clock, Image as ImageIcon, Pin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PostCardData {
  id: string;
  title: string;
  description?: string;
  state: string | null;
  city: string | null;
  thumbnail?: string | null;
  category_name?: string;
  category_slug?: string;
  username?: string;
  view_count?: number;
  is_sticky?: number;
  sticky_order?: number;
  created_at: string;
}

interface PostCardProps {
  post: PostCardData;
  categoryColor?: string;
}

const categoryColors: Record<string, string> = {
  "local-news": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "local-events": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "chinese-news": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "chinese-community": "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "casual-chat": "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "mutual-help": "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "blacklist": "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "jobs": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "hiring": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "job-seeking": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "housing": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "for-rent": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "housing-wanted": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "for-sale": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "marketplace": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "used-items": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "vehicles": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "business-transfer": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "welfare": "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  "recommendations": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  "deals": "bg-yellow-100 text-yellow-700 dark:bg-yellow-800/30 dark:text-yellow-400",
  "yellow-pages": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  "food-dining": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "home-services": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  "errands": "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "beauty": "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  "entertainment": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "healthcare": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  "legal-accounting": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  "finance": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "hardware": "bg-zinc-100 text-zinc-700 dark:bg-zinc-800/30 dark:text-zinc-400",
  "construction": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "electrical": "bg-yellow-100 text-yellow-700 dark:bg-yellow-800/30 dark:text-yellow-400",
  "auto-service": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "logistics": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "wholesale": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "education": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  "pets": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "others": "bg-zinc-100 text-zinc-700 dark:bg-zinc-800/30 dark:text-zinc-400",
  default: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800/30 dark:text-zinc-400",
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "刚刚";
  }
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}分钟前`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}小时前`;
  }
  if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}天前`;
  }
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months}个月前`;
  }
  const years = Math.floor(diffInSeconds / 31536000);
  return `${years}年前`;
}

export function PostCard({ post, categoryColor }: PostCardProps) {
  const isSticky = post.is_sticky === 1;
  const slug = post.category_slug || "others";
  const colorClass = categoryColor || categoryColors[slug] || categoryColors.default;

  return (
    <Link href={`/posts/${post.id}`} className="group block">
      <article
        className={cn(
          "relative flex gap-4 p-4 rounded-xl transition-all duration-300 bg-white border-b border-gray-100",
          isSticky
            ? "bg-amber-50/80 dark:bg-amber-950/20 border-l-4 border-blue-500 shadow-md shadow-amber-100/50 dark:shadow-amber-900/20 hover:shadow-lg"
            : "hover:bg-gray-50"
        )}
      >
        {/* Sticky Badge */}
        {isSticky && (
          <div className="absolute -top-1 -right-1">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-medium shadow-sm animate-pulse">
              <Pin className="w-3 h-3" />
              置顶
            </div>
          </div>
        )}

        {/* Image Placeholder */}
        <div className="relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden">
          {post.thumbnail ? (
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
          {/* Title */}
          <h3 className={cn(
            "text-sm sm:text-base font-medium line-clamp-2 leading-relaxed transition-colors duration-200",
            isSticky
              ? "text-zinc-900 dark:text-zinc-100"
              : "text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
          )}>
            {isSticky && <span className="mr-1">📌</span>}
            {post.title}
          </h3>

          {/* Meta Row */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {/* Category Badge */}
            {post.category_name && (
              <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", colorClass)}>
                {post.category_name}
              </span>
            )}

            {/* Location */}
            {(post.state || post.city) && (
              <span className="flex items-center gap-1 text-xs text-zinc-400">
                <MapPin className="w-3 h-3" />
                {[post.state, post.city].filter(Boolean).join(" · ")}
              </span>
            )}
          </div>

          {/* Bottom Row */}
          <div className="flex items-center justify-between mt-2 text-xs text-zinc-400">
            {/* Time */}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(post.created_at)}
            </span>

            {/* Author & Views */}
            <div className="flex items-center gap-3">
              {post.username && (
                <span>@{post.username}</span>
              )}
              {post.view_count !== undefined && post.view_count > 0 && (
                <span>{post.view_count} 浏览</span>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

// Skeleton for loading state
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
