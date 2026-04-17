"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ANNOUNCEMENT_KEY = "ushrh_announcement_closed";

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const closed = sessionStorage.getItem(ANNOUNCEMENT_KEY);
    if (closed === "true") {
      setIsVisible(false);
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem(ANNOUNCEMENT_KEY, "true");
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 transition-all duration-300",
        isClosing ? "opacity-0 max-h-0 py-0" : "opacity-100 max-h-20 py-3"
      )}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 animate-[slide_20s_linear_infinite]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-3">
          {/* Animated Text */}
          <p className="text-sm sm:text-base font-medium text-white text-center animate-[fadeInUp_0.5s_ease-out]">
            <span className="mr-2">🎉</span>
            <span className="inline-block animate-[pulse_2s_ease-in-out_infinite]">
              欢迎来到美国华人同城平台！找工作、租房、交友，一站搞定！
            </span>
          </p>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="关闭公告"
          >
            <X className="w-4 h-4 text-white/80 hover:text-white" />
          </button>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    </div>
  );
}
