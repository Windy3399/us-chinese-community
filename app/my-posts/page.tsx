"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Trash2,
  Eye,
  Clock,
  Tag,
  Loader2,
  AlertCircle,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/providers/AuthProvider";
import { toast } from "sonner";

interface MyPost {
  id: string;
  title: string;
  status: "pending" | "active" | "rejected" | "expired";
  view_count: number;
  created_at: string;
  expires_at: string | null;
  category_name: string;
  category_slug: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: {
    label: "待审核",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  active: {
    label: "已发布",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  rejected: {
    label: "已拒绝",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  expired: {
    label: "已过期",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function MyPostsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<MyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("请先登录");
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/my-posts");
      const data = await res.json();

      if (res.ok && data.data) {
        setPosts(data.data);
      } else {
        toast.error(data.error || "获取帖子失败");
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      toast.error("获取帖子失败");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("确定要删除这个帖子吗？此操作不可恢复。")) {
      return;
    }

    setDeletingId(postId);
    try {
      const res = await fetch(`/api/my-posts?id=${postId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== postId));
        toast.success("删除成功");
      } else {
        toast.error(data.error || "删除失败");
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast.error("删除失败");
    } finally {
      setDeletingId(null);
    }
  };

  // Auth loading
  if (authLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-48" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
          请先登录
        </h2>
        <p className="text-zinc-500 mb-6">登录后可查看和管理您的帖子</p>
        <Link href="/login">
          <Button>去登录</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            我的帖子
          </h1>
          <p className="text-zinc-500 mt-1">管理您发布的所有帖子</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchPosts}>
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
          <Link href="/publish">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              发布帖子
            </Button>
          </Link>
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
            暂无帖子
          </h2>
          <p className="text-zinc-500 mb-6">您还没有发布任何帖子</p>
          <Link href="/publish">
            <Button>发布您的第一个帖子</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const statusConfig = STATUS_CONFIG[post.status] || STATUS_CONFIG.pending;

            return (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <Link href={`/post/${post.id}`}>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 truncate">
                          {post.title}
                        </h3>
                      </Link>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-zinc-500">
                        {/* Category */}
                        <Badge variant="secondary" className="text-xs">
                          {post.category_name}
                        </Badge>

                        {/* Status */}
                        <Badge className={`text-xs ${statusConfig.color}`}>
                          <Tag className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </Badge>

                        {/* Views */}
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.view_count} 次浏览
                        </span>

                        {/* Created At */}
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(post.created_at)}
                        </span>

                        {/* Expires At */}
                        {post.expires_at && (
                          <span className="text-zinc-400">
                            过期: {formatDate(post.expires_at)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link href={`/post/${post.id}`}>
                        <Button variant="outline" size="sm">
                          查看
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                        onClick={() => handleDelete(post.id)}
                        disabled={deletingId === post.id}
                      >
                        {deletingId === post.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Stats */}
      {!loading && posts.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-around gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {posts.length}
                </p>
                <p className="text-sm text-zinc-500">全部帖子</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {posts.filter((p) => p.status === "active").length}
                </p>
                <p className="text-sm text-zinc-500">已发布</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {posts.filter((p) => p.status === "pending").length}
                </p>
                <p className="text-sm text-zinc-500">待审核</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-600">
                  {posts.filter((p) => p.status === "expired").length}
                </p>
                <p className="text-sm text-zinc-500">已过期</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
