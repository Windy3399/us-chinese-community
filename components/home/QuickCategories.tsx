"use client";

import Link from "next/link";
import {
  Newspaper,
  Users,
  Briefcase,
  Home,
  ShoppingBag,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const quickCategories = [
  {
    slug: "local-news",
    name: "本土资讯",
    icon: Newspaper,
    description: "本地新闻动态",
    gradient: "from-rose-500 to-red-600",
  },
  {
    slug: "chinese-community",
    name: "华人社区",
    icon: Users,
    description: "华人生活交流",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    slug: "jobs",
    name: "招聘求职",
    icon: Briefcase,
    description: "工作机会",
    gradient: "from-sky-500 to-blue-600",
  },
  {
    slug: "housing",
    name: "房屋租售",
    icon: Home,
    description: "房产信息",
    gradient: "from-emerald-500 to-green-600",
  },
  {
    slug: "marketplace",
    name: "同城交易",
    icon: ShoppingBag,
    description: "二手买卖",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    slug: "yellow-pages",
    name: "行业黄页",
    icon: BookOpen,
    description: "商家服务",
    color: "from-indigo-500 to-blue-700",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    iconColor: "text-indigo-500",
  },
];

export function QuickCategories() {
  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">🔍</span>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          分类浏览
        </h2>
      </div>

      {/* 2-column Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group"
            >
              <div className="relative h-full flex flex-col items-center p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:shadow-xl hover:border-transparent transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                {/* Background Gradient on Hover */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    category.color,
                    "from-opacity-5 to-opacity-10"
                  )}
                />

                {/* Content */}
                <div className="relative flex flex-col items-center text-center gap-4">
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
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Accent Line */}
                <div
                  className={cn(
                    "absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-3/4",
                    category.color
                  )}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
