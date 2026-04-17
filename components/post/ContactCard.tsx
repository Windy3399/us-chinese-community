"use client";

import { Phone, MessageCircle, User, Clock, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactCardProps {
  username?: string;
  phone?: string | null;
  wechat?: string | null;
  createdAt?: string;
  viewCount?: number;
  className?: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ContactCard({
  username,
  phone,
  wechat,
  createdAt,
  viewCount,
  className,
}: ContactCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-5",
        className
      )}
    >
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 rounded-2xl p-px bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-500 opacity-20">
        <div className="w-full h-full rounded-2xl bg-white dark:bg-zinc-900" />
      </div>

      {/* Content */}
      <div className="relative space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              {username || "匿名用户"}
            </p>
            <p className="text-xs text-zinc-500">
              发布者
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent" />

        {/* Contact Buttons */}
        <div className="space-y-3">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/50 dark:border-emerald-800/50 hover:shadow-md transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">电话</p>
                <p className="font-medium text-emerald-700 dark:text-emerald-300">
                  {phone}
                </p>
              </div>
            </a>
          )}

          {wechat && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200/50 dark:border-green-800/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.87c-.136-.003-.272-.01-.407-.01zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs text-green-600 dark:text-green-400">微信</p>
                <p className="font-medium text-green-700 dark:text-green-300">
                  {wechat}
                </p>
              </div>
              <button className="p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.848 14.308l-5.308-3.051v6.127a.308.308 0 0 0 .615 0V11.41l5.308 3.051a.308.308 0 1 0 .308-.535l-6.154-3.538a.615.615 0 0 0-.615 0L11.077 14a.308.308 0 1 0 .308.535l1.846-1.062v4.246a.308.308 0 1 0 .615 0V12.79l4.616 2.653a.308.308 0 1 0 .308-.535l-5.308-3.051v-.923a.923.923 0 0 0-1.846 0v.923l-5.308 3.051a.308.308 0 1 0 .308.535l6.154-3.538a.615.615 0 0 0 .308-.538V8.308a.308.308 0 1 0-.615 0v4.246l-1.846-1.062a.308.308 0 1 0-.308.535l5.308 3.051v.923a.923.923 0 0 0 1.846 0v-.923l5.308-3.051a.308.308 0 0 0-.154-.578z"/>
                </svg>
              </button>
            </div>
          )}

          {!phone && !wechat && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
              <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <p className="text-xs text-zinc-500">联系方式</p>
                <p className="text-sm text-zinc-400">发布者未提供联系方式</p>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent" />

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-zinc-500">
          {createdAt && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(createdAt)}
            </span>
          )}
          {viewCount !== undefined && (
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {viewCount} 次浏览
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
