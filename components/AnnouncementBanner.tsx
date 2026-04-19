"use client";

import { useState } from "react";

type AnnouncementStyle = "info" | "warning" | "error" | "success";

interface Announcement {
  enabled: boolean;
  content: string;
  style: AnnouncementStyle;
}

// 静态公告数据（可编辑）
const staticAnnouncement: Announcement = {
  enabled: true,
  content: "🎉 欢迎来到美国华人同城！网站正在试运行，欢迎注册发布信息。",
  style: "info",
};

export default function AnnouncementBanner() {
  const [loading, setLoading] = useState(true);

  // 模拟加载完成（静态数据不需要请求）
  useState(() => {
    setTimeout(() => setLoading(false), 0);
  });

  if (loading || !staticAnnouncement.enabled) {
    return null;
  }

  const styleMap = {
    info: "bg-blue-500 text-white",
    warning: "bg-orange-500 text-white",
    error: "bg-red-500 text-white",
    success: "bg-green-500 text-white",
  };

  return (
    <div className={`${styleMap[staticAnnouncement.style]} px-4 py-3 text-center`}>
      <p className="whitespace-pre-wrap text-sm">{staticAnnouncement.content}</p>
    </div>
  );
}
