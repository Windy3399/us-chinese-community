"use client";

import { useEffect, useState } from "react";

type AnnouncementStyle = "info" | "warning" | "error" | "success";

interface Announcement {
  enabled: boolean;
  content: string;
  style: AnnouncementStyle;
}

export default function NoticesPage() {
  const [announcement, setAnnouncement] = useState<Announcement>({
    enabled: false,
    content: "",
    style: "info",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    try {
      const response = await fetch("/api/admin/kv");
      const data = await response.json();
      if (data.success) {
        setAnnouncement(data.data.announcement);
      }
    } catch (error) {
      console.error("Failed to fetch announcement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/kv", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "site_announcement",
          value: announcement,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ type: "success", text: "保存成功" });
      } else {
        setMessage({ type: "error", text: data.error || "保存失败" });
      }
    } catch (error) {
      console.error("Failed to save:", error);
      setMessage({ type: "error", text: "保存失败" });
    } finally {
      setSaving(false);
    }
  };

  const styleOptions: { value: AnnouncementStyle; label: string; color: string }[] = [
    { value: "info", label: "蓝色提示", color: "bg-blue-500" },
    { value: "success", label: "绿色成功", color: "bg-green-500" },
    { value: "warning", label: "橙色警告", color: "bg-orange-500" },
    { value: "error", label: "红色错误", color: "bg-red-500" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">公告管理</h1>
      </div>

      {/* Announcement Banner Preview */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">预览</h2>
        <div
          className={`${
            announcement.style === "info"
              ? "bg-blue-500"
              : announcement.style === "success"
              ? "bg-green-500"
              : announcement.style === "warning"
              ? "bg-orange-500"
              : "bg-red-500"
          } text-white px-4 py-3 rounded-lg`}
        >
          {announcement.enabled ? (
            <p className="whitespace-pre-wrap">{announcement.content || "请输入公告内容..."}</p>
          ) : (
            <p className="opacity-60 italic">公告已关闭</p>
          )}
        </div>
      </div>

      {/* Announcement Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">公告设置</h2>

        {/* Enable Switch */}
        <div className="flex items-center gap-4 mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={announcement.enabled}
                onChange={(e) => setAnnouncement({ ...announcement, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
            </div>
            <span className="text-gray-700 font-medium">启用公告</span>
          </label>
        </div>

        {/* Style Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">样式</label>
          <div className="flex gap-3">
            {styleOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setAnnouncement({ ...announcement, style: opt.value })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  announcement.style === opt.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className={`w-4 h-4 rounded-full ${opt.color}`}></span>
                <span className="text-sm">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">公告内容</label>
          <textarea
            value={announcement.content}
            onChange={(e) => setAnnouncement({ ...announcement, content: e.target.value })}
            rows={4}
            placeholder="输入公告内容..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? "保存中..." : "保存设置"}
          </button>
          {message && (
            <span
              className={`text-sm ${
                message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message.text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}