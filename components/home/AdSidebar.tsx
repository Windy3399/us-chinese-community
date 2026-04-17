"use client";

import { Megaphone, Mail, Sparkles } from "lucide-react";

export function AdSidebar() {
  return (
    <aside className="space-y-4">
      {/* Ad Card 1 */}
      <div className="relative group">
        <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-600 transition-colors duration-300">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-purple-950/30" />

          {/* Animated Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-blue-400/20 blur-2xl animate-pulse" />
            <div className="absolute bottom-4 right-4 w-20 h-20 rounded-full bg-purple-400/20 blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>

          <div className="relative p-6 flex flex-col items-center text-center">
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
              <Megaphone className="w-7 h-7 text-white" />
            </div>

            {/* Content */}
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-2">
              广告位招商中
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
              精准触达北美10万+华人用户<br />
              提升品牌曝光度
            </p>

            {/* Contact */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
              <Mail className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                ad@uschinese.com
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ad Card 2 - Decorative */}
      <div className="relative group">
        <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-amber-400 dark:hover:border-amber-600 transition-colors duration-300">
          {/* Warm Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-yellow-950/30" />

          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-400/20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative p-6 flex flex-col items-center text-center">
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-7 h-7 text-white" />
            </div>

            {/* Content */}
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-2">
              黄金广告位
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
              首页置顶展示<br />
              抢占用户第一视线
            </p>

            {/* CTA */}
            <button className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40 transition-all duration-300 hover:-translate-y-0.5">
              了解更多
            </button>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 p-5">
        {/* Glow Effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

        <div className="text-center">
          <p className="text-xs text-zinc-400 mb-3">平台数据</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-2xl font-bold text-white mb-1">10万+</div>
              <div className="text-xs text-zinc-500">活跃用户</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-1">50+</div>
              <div className="text-xs text-zinc-500">覆盖城市</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
