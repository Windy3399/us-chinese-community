"use client";

import type { Post } from "../types";

interface PostTableProps {
  posts: Post[];
  loading: boolean;
  selectedIds: Set<string>;
  onSelect: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  onReview: (post: Post) => void;
  onStickyChange: (postId: string, isSticky: boolean, stickyOrder: number) => void;
}

export default function PostTable({
  posts,
  loading,
  selectedIds,
  onSelect,
  onSelectAll,
  isAllSelected,
  isIndeterminate,
  onReview,
  onStickyChange,
}: PostTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        加载中...
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        暂无帖子
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      active: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      expired: "bg-gray-100 text-gray-800",
    };
    const labels: Record<string, string> = {
      pending: "待审核",
      active: "已通过",
      rejected: "已拒绝",
      expired: "已过期",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="w-12 px-4 py-3 text-left">
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isIndeterminate;
                }}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="w-4 h-4 rounded"
              />
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">标题</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">分类</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">地区</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">置顶</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">发布时间</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {posts.map((post) => (
            <tr
              key={post.id}
              className={`hover:bg-gray-50 ${post.is_sticky ? "bg-yellow-50" : ""}`}
            >
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedIds.has(post.id)}
                  onChange={(e) => onSelect(post.id, e.target.checked)}
                  className="w-4 h-4 rounded"
                />
              </td>
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-gray-800 line-clamp-1">{post.title}</p>
                  <p className="text-sm text-gray-500">@{post.username}</p>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{post.category_name}</td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {post.state} {post.city}
              </td>
              <td className="px-4 py-3">{getStatusBadge(post.status)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onStickyChange(post.id, !post.is_sticky, post.sticky_order || 0)}
                    className={`text-lg ${post.is_sticky ? "text-yellow-500" : "text-gray-300"}`}
                    title={post.is_sticky ? "取消置顶" : "设为置顶"}
                  >
                    📌
                  </button>
                  {post.is_sticky ? (
                    <input
                      type="number"
                      min="0"
                      value={post.sticky_order || 0}
                      onChange={(e) =>
                        onStickyChange(post.id, true, parseInt(e.target.value) || 0)
                      }
                      className="w-16 px-2 py-1 text-sm border rounded text-center"
                    />
                  ) : null}
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {new Date(post.created_at).toLocaleString("zh-CN")}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onReview(post)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    审核
                  </button>
                  <a
                    href={`/post/${post.id}`}
                    target="_blank"
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    查看
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}