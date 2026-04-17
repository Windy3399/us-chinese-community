"use client";

import { useEffect, useState } from "react";
import PostTable from "./components/PostTable";
import BulkActionBar from "./components/BulkActionBar";
import StatusFilter from "./components/StatusFilter";
import ReviewModal from "./components/ReviewModal";
import type { Post } from "./types";

type StatusFilter = "all" | "pending" | "active" | "rejected";

export type { StatusFilter };

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, [statusFilter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      const response = await fetch(`/api/admin/posts?${params}`);
      const data = await response.json();
      if (data.success) {
        setPosts(data.data.posts);
        setTotal(data.data.total);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(posts.map((p) => p.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleBulkAction = async (action: "approve" | "reject") => {
    if (selectedIds.size === 0) return;

    try {
      const promises = Array.from(selectedIds).map((id) =>
        fetch(`/api/admin/posts/${id}/review`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        })
      );
      await Promise.all(promises);
      setSelectedIds(new Set());
      fetchPosts();
    } catch (error) {
      console.error("Bulk action failed:", error);
    }
  };

  const handleReview = (post: Post) => {
    setCurrentPost(post);
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = async (action: "approve" | "reject") => {
    if (!currentPost) return;
    try {
      const response = await fetch(`/api/admin/posts/${currentPost.id}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (response.ok) {
        setReviewModalOpen(false);
        fetchPosts();
      }
    } catch (error) {
      console.error("Review action failed:", error);
    }
  };

  const handleStickyChange = async (postId: string, isSticky: boolean, stickyOrder: number) => {
    try {
      await fetch(`/api/admin/posts/${postId}/sticky`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_sticky: isSticky ? 1 : 0, sticky_order: stickyOrder }),
      });
      fetchPosts();
    } catch (error) {
      console.error("Sticky change failed:", error);
    }
  };

  const isAllSelected = posts.length > 0 && selectedIds.size === posts.length;
  const isIndeterminate = selectedIds.size > 0 && selectedIds.size < posts.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">帖子审核</h1>
        <div className="flex items-center gap-4">
          <StatusFilter value={statusFilter} onChange={setStatusFilter} />
          <div className="text-sm text-gray-500">
            共 {total} 条
          </div>
        </div>
      </div>

      {selectedIds.size > 0 && (
        <BulkActionBar
          selectedCount={selectedIds.size}
          onApprove={() => handleBulkAction("approve")}
          onReject={() => handleBulkAction("reject")}
          onClear={() => setSelectedIds(new Set())}
        />
      )}

      <PostTable
        posts={posts}
        loading={loading}
        selectedIds={selectedIds}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
        isAllSelected={isAllSelected}
        isIndeterminate={isIndeterminate}
        onReview={handleReview}
        onStickyChange={handleStickyChange}
      />

      {currentPost && (
        <ReviewModal
          post={currentPost}
          open={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
}