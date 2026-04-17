"use client";

import type { User } from "../types";

interface UserTableProps {
  users: User[];
  loading: boolean;
  onUpdateUser: (userId: string, updates: { isBanned?: number; isUnlimited?: number; role?: string }) => void;
}

export default function UserTable({ users, loading, onUpdateUser }: UserTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        加载中...
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        暂无用户
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">用户</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">邮箱</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">角色</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">今日发帖</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">今日评论</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-gray-800">{user.username}</p>
                  <p className="text-xs text-gray-500 truncate max-w-xs">{user.id}</p>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user.role === "admin" ? "管理员" : "用户"}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {user.daily_post_count}/15
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {user.daily_comment_count}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.role === "admin" ? "管理员" : "用户"}
                  </span>
                  {user.is_banned === 1 ? (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                      已封禁
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      正常
                    </span>
                  )}
                  {user.is_unlimited === 1 && !(user.role === "admin") && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                      无限制
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onUpdateUser(user.id, {
                        isBanned: user.is_banned === 1 ? 0 : 1,
                      })
                    }
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      user.is_banned === 1
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {user.is_banned === 1 ? "解封" : "封禁"}
                  </button>
                  <button
                    onClick={() =>
                      onUpdateUser(user.id, {
                        isUnlimited: user.is_unlimited === 1 ? 0 : 1,
                      })
                    }
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      user.is_unlimited === 1
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                    }`}
                  >
                    {user.is_unlimited === 1 ? "取消无限" : "设为无限"}
                  </button>
                  {user.role !== "admin" && (
                    <button
                      onClick={() =>
                        onUpdateUser(user.id, {
                          role: "admin",
                        })
                      }
                      className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                    >
                      设管理员
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}