"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Menu,
  X,
  User,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { ExchangeRate } from "@/components/home/ExchangeRate";

const navLinks = [
  { href: "/", label: "首页" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, logout, fetchUser, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) {
      fetchUser();
    }
  }, [isHydrated, fetchUser]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  const isLoggedIn = !!user;

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="relative backdrop-blur-xl bg-white/80 dark:bg-zinc-950/80 shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10" />
                </div>
                <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  美国华人同城
                </span>
              </Link>

              <nav className="hidden lg:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300",
                      pathname === link.href
                        ? "text-blue-600 bg-blue-50 dark:bg-blue-950/50"
                        : "text-zinc-600 hover:text-blue-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* 汇率显示 */}
                <div className="ml-2">
                  <ExchangeRate />
                </div>
              </nav>
            </div>

            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  placeholder="搜索帖子、分类..."
                  className="w-full pl-10 pr-4 h-10 bg-zinc-100/80 dark:bg-zinc-800/80 border-0 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500/50 transition-all duration-300 placeholder:text-zinc-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300 group cursor-pointer">
                    <Avatar className="w-8 h-8 ring-2 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-sm font-medium">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-2 p-1.5 rounded-xl shadow-xl border-zinc-200/50 dark:border-zinc-800/50">
                    <div className="px-3 py-2 mb-1">
                      <p className="text-sm font-medium">{user?.username || "用户"}</p>
                      <p className="text-xs text-zinc-500">{user?.email || ""}</p>
                    </div>
                    <DropdownMenuSeparator className="my-1.5 bg-zinc-200/50 dark:bg-zinc-700/50" />
                    <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 transition-colors">
                      <Link href="/profile" className="flex items-center gap-2.5 w-full">
                        <User className="w-4 h-4" />
                        <span className="text-sm">个人中心</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 transition-colors">
                      <Link href="/my-posts" className="flex items-center gap-2.5 w-full">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">我的帖子</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 transition-colors">
                      <Link href="/settings" className="flex items-center gap-2.5 w-full">
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">设置</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1.5 bg-zinc-200/50 dark:bg-zinc-700/50" />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 transition-colors">
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">退出登录</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className="h-9 px-4 text-sm font-medium text-zinc-600 hover:text-blue-600 hover:bg-blue-50 dark:text-zinc-300 dark:hover:text-blue-400 dark:hover:bg-blue-950/50 transition-all duration-300"
                    >
                      登录
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      className="h-9 px-4 text-sm font-medium bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      注册
                    </Button>
                  </Link>
                </div>
              )}

              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300 cursor-pointer">
                  <Menu className="w-5 h-5" />
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0 border-l-zinc-200/50 dark:border-l-zinc-800/50">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-zinc-200/50 dark:border-zinc-800/50">
                      <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        菜单
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 rounded-lg"
                        onClick={() => setMobileOpen(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="p-4">
                      <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                          placeholder="搜索..."
                          className="w-full pl-10 pr-4 h-11 bg-zinc-100/80 dark:bg-zinc-800/80 border-0 rounded-xl"
                        />
                      </div>
                    </div>

                    <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300",
                            pathname === link.href
                              ? "text-blue-600 bg-blue-50 dark:bg-blue-950/50"
                              : "text-zinc-600 hover:text-blue-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                          )}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>

                    {!isLoggedIn && (
                      <div className="p-4 border-t border-zinc-200/50 dark:border-zinc-800/50 space-y-2">
                        <Link href="/login" onClick={() => setMobileOpen(false)}>
                          <Button
                            variant="outline"
                            className="w-full h-11 text-sm font-medium border-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-300"
                          >
                            登录
                          </Button>
                        </Link>
                        <Link href="/register" onClick={() => setMobileOpen(false)}>
                          <Button
                            className="w-full h-11 text-sm font-medium bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/25 transition-all duration-300"
                          >
                            注册
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
