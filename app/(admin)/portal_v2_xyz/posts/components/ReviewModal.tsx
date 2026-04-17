"use client";

import type { Post } from "../types";

interface ReviewModalProps {
  post: Post;
  open: boolean;
  onClose: () => void;
  onSubmit: (action: "approve" | "reject") => void;
}

export default function ReviewModal({ post, open, onClose, onSubmit }: ReviewModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">审核帖子</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">标题</h3>
            <p className="text-gray-600">{post.title}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">描述</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{post.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">发布者：</span>
              <span className="text-gray-700">{post.username}</span>
            </div>
            <div>
              <span className="text-gray-500">分类：</span>
              <span className="text-gray-700">{post.category_name}</span>
            </div>
            <div>
              <span className="text-gray-500">地区：</span>
              <span className="text-gray-700">{post.state} {post.city}</span>
            </div>
            <div>
              <span className="text-gray-500">发布时间：</span>
              <span className="text-gray-700">
                {new Date(post.created_at).toLocaleString("zh-CN")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => onSubmit("reject")}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            ❌ 拒绝
          </button>
          <button
            onClick={() => onSubmit("approve")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            ✅ 通过
          </button>
        </div>
      </div>
    </div>
  );
}