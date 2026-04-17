"use client";

import { useEffect, useState } from "react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: string;
  gradient: string;
}

function StatsCard({ title, value, icon, gradient }: StatsCardProps) {
  return (
    <div className={`rounded-xl p-6 text-white ${gradient} shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80 mb-1">{title}</p>
          <p className="text-3xl font-bold">{value.toLocaleString()}</p>
        </div>
        <span className="text-4xl opacity-80">{icon}</span>
      </div>
    </div>
  );
}

interface StatsData {
  totalPosts: number;
  pendingPosts: number;
  todayPosts: number;
  totalUsers: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData>({
    totalPosts: 0,
    pendingPosts: 0,
    todayPosts: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">数据概览</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="总帖子数"
          value={stats.totalPosts}
          icon="📝"
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatsCard
          title="待审核"
          value={stats.pendingPosts}
          icon="⏳"
          gradient="bg-gradient-to-br from-orange-500 to-orange-600"
        />
        <StatsCard
          title="今日新增"
          value={stats.todayPosts}
          icon="📈"
          gradient="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatsCard
          title="用户总数"
          value={stats.totalUsers}
          icon="👥"
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">快捷操作</h2>
        <div className="flex gap-4">
          <a
            href="/admin/portal_v2_xyz/posts"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            审核帖子
          </a>
          <a
            href="/admin/portal_v2_xyz/users"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            管理用户
          </a>
        </div>
      </div>
    </div>
  );
}