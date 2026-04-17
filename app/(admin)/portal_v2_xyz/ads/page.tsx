"use client";

import { useEffect, useState } from "react";

interface Ad {
  id: number;
  title: string;
  position: string;
  image_url: string;
  link_url: string;
  is_active: number;
  is_global: number;
  priority: number;
  category_id: number | null;
  category_name: string | null;
  created_at: string;
}

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    position: "homepage_top",
    image_url: "",
    link_url: "",
    is_global: 0,
    priority: 0,
    category_id: null as number | null,
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await fetch("/api/admin/ads");
      const data = await response.json();
      if (data.success) {
        setAds(data.data.ads);
      }
    } catch (error) {
      console.error("Failed to fetch ads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/admin/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setFormData({ title: "", position: "homepage_top", image_url: "", link_url: "", is_global: 0, priority: 0, category_id: null });
      setShowForm(false);
      fetchAds();
    } catch (error) {
      console.error("Failed to create ad:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除此广告？")) return;
    try {
      await fetch(`/api/admin/ads?id=${id}`, { method: "DELETE" });
      fetchAds();
    } catch (error) {
      console.error("Failed to delete ad:", error);
    }
  };

  const handleToggleActive = async (id: number, currentActive: number) => {
    try {
      await fetch("/api/admin/ads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: currentActive === 1 ? 0 : 1 }),
      });
      fetchAds();
    } catch (error) {
      console.error("Failed to toggle ad:", error);
    }
  };

  const handleToggleGlobal = async (id: number, currentGlobal: number) => {
    try {
      await fetch("/api/admin/ads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_global: currentGlobal === 1 ? 0 : 1 }),
      });
      fetchAds();
    } catch (error) {
      console.error("Failed to toggle global:", error);
    }
  };

  const getPositionLabel = (position: string) => {
    const labels: Record<string, string> = {
      homepage_top: "首页顶部",
      homepage_sidebar: "首页侧边",
      post_detail_top: "帖子详情顶部",
      post_detail_bottom: "帖子详情底部",
    };
    return labels[position] || position;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">广告管理</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? "取消添加" : "添加广告"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">广告位</label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="homepage_top">首页顶部</option>
                <option value="homepage_sidebar">首页侧边</option>
                <option value="post_detail_top">帖子详情顶部</option>
                <option value="post_detail_bottom">帖子详情底部</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">图片URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">链接URL</label>
              <input
                type="url"
                value={formData.link_url}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">优先级</label>
              <input
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="数值越大越靠前"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_global"
                  checked={formData.is_global === 1}
                  onChange={(e) => setFormData({ ...formData, is_global: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4"
                />
                <label htmlFor="is_global" className="text-sm font-medium text-gray-700">全局广告</label>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            添加
          </button>
        </form>
      )}

      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          加载中...
        </div>
      ) : ads.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          暂无广告
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ads.map((ad) => (
            <div key={ad.id} className="bg-white rounded-lg shadow overflow-hidden">
              <img
                src={ad.image_url}
                alt={ad.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">{ad.title}</h3>
                <div className="flex flex-wrap items-center gap-2 text-sm mb-2">
                  <span className="px-2 py-1 bg-gray-100 rounded">{getPositionLabel(ad.position)}</span>
                  <span className={`px-2 py-1 rounded ${ad.is_global ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-600"}`}>
                    {ad.is_global ? "全局" : ad.category_name || "未分类"}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">优先级: {ad.priority}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={`px-2 py-1 rounded-full ${ad.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                    {ad.is_active ? "显示中" : "已关闭"}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => handleToggleActive(ad.id, ad.is_active)}
                    className={`flex-1 px-3 py-1 text-sm rounded transition-colors ${ad.is_active ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                  >
                    {ad.is_active ? "关闭" : "启用"}
                  </button>
                  <button
                    onClick={() => handleToggleGlobal(ad.id, ad.is_global)}
                    className={`flex-1 px-3 py-1 text-sm rounded transition-colors ${ad.is_global ? "bg-purple-100 text-purple-700 hover:bg-purple-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    {ad.is_global ? "取消全局" : "设为全局"}
                  </button>
                  <button
                    onClick={() => handleDelete(ad.id)}
                    className="flex-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}