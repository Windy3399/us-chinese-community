"use client";

import { useEffect, useState } from "react";

type AnnouncementStyle = "info" | "warning" | "error" | "success";

interface Announcement {
  enabled: boolean;
  content: string;
  style: AnnouncementStyle;
}

export default function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    try {
      const response = await fetch("/api/announcement");
      const data = await response.json();
      if (data.success && data.data.enabled) {
        setAnnouncement(data.data);
      } else {
        setAnnouncement(null);
      }
    } catch (error) {
      console.error("Failed to fetch announcement:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !announcement) {
    return null;
  }

  const styleMap = {
    info: "bg-blue-500 text-white",
    warning: "bg-orange-500 text-white",
    error: "bg-red-500 text-white",
    success: "bg-green-500 text-white",
  };

  return (
    <div className={`${styleMap[announcement.style]} px-4 py-3 text-center`}>
      <p className="whitespace-pre-wrap">{announcement.content}</p>
    </div>
  );
}