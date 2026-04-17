"use client";

import Link from "next/link";
import {
  Newspaper,
  Users,
  Briefcase,
  Home,
  ShoppingBag,
  Gift,
  ThumbsUp,
  Tag,
  BookOpen,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  {
    slug: "local-news",
    name: "本土资讯",
    icon: Newspaper,
    gradient: "from-rose-500 to-red-600",
  },
  {
    slug: "chinese-community",
    name: "华人社区",
    icon: Users,
    gradient: "from-violet-500 to-purple-600",
  },
  {
    slug: "jobs",
    name: "招聘求职",
    icon: Briefcase,
    gradient: "from-sky-500 to-blue-600",
  },
  {
    slug: "housing",
    name: "房屋租售",
    icon: Home,
    gradient: "from-emerald-500 to-green-600",
  },
  {
    slug: "marketplace",
    name: "同城交易",
    icon: ShoppingBag,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    slug: "welfare",
    name: "福利放送",
    icon: Gift,
    gradient: "from-pink-400 to-pink-600",
  },
  {
    slug: "recommendations",
    name: "好趣推荐",
    icon: ThumbsUp,
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    slug: "deals",
    name: "商家优惠",
    icon: Tag,
    gradient: "from-yellow-500 to-amber-600",
  },
  {
    slug: "yellow-pages",
    name: "行业黄页",
    icon: BookOpen,
    gradient: "from-indigo-500 to-blue-700",
  },
  {
    slug: "others",
    name: "其他",
    icon: MoreHorizontal,
    gradient: "from-zinc-400 to-zinc-600",
  },
];

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="group relative"
          >
            <div className="relative bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-xl hover:border-transparent transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              {/* Background Gradient on Hover */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  category.gradient
                )}
              />

              {/* Content */}
              <div className="relative flex flex-col items-center text-center gap-3">
                {/* Icon - 56x56px圆角方块 + 双色渐变 + 白色图标 + 阴影 */}
                <div
                  className={cn(
                    "relative w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg",
                    "bg-gradient-to-br",
                    category.gradient
                  )}
                >
                  <Icon className="w-7 h-7 text-white relative z-10" />
                </div>

                {/* Label */}
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors duration-300">
                  {category.name}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
