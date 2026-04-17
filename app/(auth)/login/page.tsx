"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  
  const { login, isLoading, error, user, fetchUser, isHydrated } = useAuthStore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!isHydrated) {
      fetchUser();
    }
  }, [isHydrated, fetchUser]);

  useEffect(() => {
    if (isHydrated && user) {
      router.push(redirect);
    }
  }, [user, isHydrated, redirect, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    if (!email || !password) {
      setLocalError("请填写所有字段");
      return;
    }

    const success = await login(email, password);
    if (success) {
      router.push(redirect);
    }
  };

  const displayError = localError || error;

  return (
    <div className="relative">
      {/* Back to home link */}
      <Link 
        href="/"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-blue-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回首页
      </Link>

      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          美国华人同城
        </span>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200/50 dark:border-zinc-800/50 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            欢迎回来
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            登录您的账号，开始探索
          </p>
        </div>

        {/* Error Message */}
        {displayError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50">
            <p className="text-sm text-red-600 dark:text-red-400 text-center">
              {displayError}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              邮箱地址
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="pl-12 h-12 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              密码
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                type="password"
                placeholder="输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="pl-12 h-12 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-300 mt-6"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                登录中...
              </span>
            ) : (
              "登录"
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-700" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white dark:bg-zinc-900 text-sm text-zinc-400">
              或
            </span>
          </div>
        </div>

        {/* Register Link */}
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          还没有账号？{" "}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline underline-offset-4 transition-colors"
          >
            立即注册
          </Link>
        </p>
      </div>

      {/* Terms */}
      <p className="text-center text-xs text-zinc-400 mt-6">
        登录即表示您同意我们的{" "}
        <Link href="/terms" className="hover:text-blue-600 transition-colors">
          服务条款
        </Link>
        {" "}和{" "}
        <Link href="/privacy" className="hover:text-blue-600 transition-colors">
          隐私政策
        </Link>
      </p>
    </div>
  );
}
