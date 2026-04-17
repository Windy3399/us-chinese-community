"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  username: string;
}

interface CommentSectionProps {
  postId: string;
  className?: string;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 7) {
    return date.toLocaleDateString("zh-CN", {
      month: "long",
      day: "numeric",
    });
  } else if (diffDay > 0) {
    return `${diffDay}天前`;
  } else if (diffHour > 0) {
    return `${diffHour}小时前`;
  } else if (diffMin > 0) {
    return `${diffMin}分钟前`;
  } else {
    return "刚刚";
  }
}

export function CommentSection({ postId, className }: CommentSectionProps) {
  const { user, isHydrated } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/posts/${postId}/comments?postId=${postId}&page=${page}`
      );
      const data = await response.json();

      if (response.ok && data.data) {
        if (page === 1) {
          setComments(data.data.comments);
        } else {
          setComments((prev) => [...prev, ...data.data.comments]);
        }
        setHasMore(data.data.page < data.data.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsLoading(false);
    }
  }, [postId, page]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async () => {
    if (!newComment.trim()) {
      toast.error("请输入评论内容");
      return;
    }

    if (!isHydrated || !user) {
      toast.error("请先登录后再评论");
      return;
    }

    setIsSubmitting(true);

    // 乐观更新
    const optimisticComment: Comment = {
      id: `temp-${Date.now()}`,
      post_id: postId,
      user_id: user.id,
      content: newComment.trim(),
      created_at: new Date().toISOString(),
      username: user.username,
    };
    setComments((prev) => [optimisticComment, ...prev]);
    setNewComment("");

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          postId,
          content: newComment.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // 回滚乐观更新
        setComments((prev) => prev.filter((c) => c.id !== optimisticComment.id));
        toast.error(data.error || "评论失败");
        setNewComment(newComment.trim());
        return;
      }

      // 替换临时评论为真实评论
      setComments((prev) =>
        prev.map((c) =>
          c.id === optimisticComment.id ? data.data : c
        )
      );
      toast.success("评论成功");
    } catch (error) {
      console.error("Submit comment error:", error);
      setComments((prev) => prev.filter((c) => c.id !== optimisticComment.id));
      toast.error("网络错误，请稍后重试");
      setNewComment(newComment.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          评论 ({comments.length})
        </h2>
      </div>

      {/* Comment Input */}
      {isHydrated && user ? (
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-medium shrink-0">
            {user.username.slice(0, 1).toUpperCase()}
          </div>
          <div className="flex-1 space-y-3">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="写下你的评论... (Ctrl+Enter 发送)"
              maxLength={500}
              rows={3}
              disabled={isSubmitting}
              className="resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">
                {newComment.length}/500
              </span>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !newComment.trim()}
                size="sm"
                className="gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                发送
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            请登录后参与评论
          </p>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-zinc-400" />
          </div>
          <p className="text-zinc-500 dark:text-zinc-400">
            💬 暂无评论，说点什么吧
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-3 p-4 rounded-xl bg-white dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-medium shrink-0">
                {comment.username?.slice(0, 1).toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {comment.username || "匿名用户"}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {formatTimeAgo(comment.created_at)}
                  </span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-300 text-sm whitespace-pre-wrap break-words">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}

          {/* Load More */}
          {hasMore && (
            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  加载中...
                </>
              ) : (
                "加载更多评论"
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}