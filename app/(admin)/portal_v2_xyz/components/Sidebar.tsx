"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    name: "数据概览",
    href: "/portal_v2_xyz/dashboard",
    icon: "📊",
  },
  {
    name: "帖子审核",
    href: "/portal_v2_xyz/posts",
    icon: "✅",
  },
  {
    name: "用户管理",
    href: "/portal_v2_xyz/users",
    icon: "👥",
  },
  {
    name: "公告管理",
    href: "/portal_v2_xyz/notices",
    icon: "📢",
  },
  {
    name: "广告管理",
    href: "/portal_v2_xyz/ads",
    icon: "📺",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-800 text-white flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold">管理后台</h1>
        <p className="text-sm text-slate-400 mt-1">US Chinese Community</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors"
        >
          <span>🏠</span>
          <span>返回前台</span>
        </Link>
      </div>
    </aside>
  );
}