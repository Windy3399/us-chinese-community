"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PostCard } from "@/components/post/PostCard";
import { PostCardSkeleton } from "@/components/skeletons";
import Link from "next/link";

interface SearchPost {
  id: string;
  title: string;
  description: string;
  state: string | null;
  city: string | null;
  status: string;
  view_count: number;
  created_at: string;
  category_name: string;
  category_slug: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [posts, setPosts] = useState<SearchPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [categoryId, setCategoryId] = useState<string | null>("");
  const [state, setState] = useState<string | null>("");

  const limit = 20;

  const fetchPosts = useCallback(async (searchQuery: string, pageNum: number) => {
    if (!searchQuery.trim()) {
      setPosts([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        page: pageNum.toString(),
        limit: limit.toString()
      });

      if (categoryId) params.append("categoryId", categoryId);
      if (state) params.append("state", state);

      const res = await fetch(`/api/search?${params}`);
      const data = await res.json();

      if (res.ok && data.data) {
        setPosts(data.data);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, [categoryId, state]);

  useEffect(() => {
    fetchPosts(query, page);
  }, [query, page, categoryId, state, fetchPosts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPosts(query, 1);
  };

  const clearFilters = () => {
    setCategoryId("");
    setState("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          搜索帖子
        </h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <Input
              type="text"
              placeholder="搜索帖子标题或内容..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 h-12 text-lg"
            />
          </div>
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "搜索"}
          </Button>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-zinc-500" />
            <span className="text-sm text-zinc-500">筛选:</span>
          </div>

          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="全部分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">全部分类</SelectItem>
              <SelectItem value="1">📰 本土资讯</SelectItem>
              <SelectItem value="2">👥 华人社区</SelectItem>
              <SelectItem value="3">💼 招聘求职</SelectItem>
              <SelectItem value="4">🏠 房屋租售</SelectItem>
              <SelectItem value="5">🛒 同城交易</SelectItem>
              <SelectItem value="6">🎁 福利放送</SelectItem>
              <SelectItem value="7">👍 好趣推荐</SelectItem>
              <SelectItem value="8">🏷️ 商家优惠</SelectItem>
              <SelectItem value="9">📖 行业黄页</SelectItem>
            </SelectContent>
          </Select>

          <Select value={state} onValueChange={setState}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="全部州" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">全部州</SelectItem>
              <SelectItem value="California">California (加州)</SelectItem>
              <SelectItem value="New York">New York (纽约)</SelectItem>
              <SelectItem value="Texas">Texas (德州)</SelectItem>
              <SelectItem value="Florida">Florida (佛罗里达)</SelectItem>
              <SelectItem value="Washington">Washington (华盛顿)</SelectItem>
              <SelectItem value="Massachusetts">Massachusetts (麻省)</SelectItem>
            </SelectContent>
          </Select>

          {(categoryId || state) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              清除筛选
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      {!query.trim() ? (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
            输入关键词开始搜索
          </h2>
          <p className="text-zinc-500">搜索帖子标题和内容</p>
        </div>
      ) : loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
            未找到相关帖子
          </h2>
          <p className="text-zinc-500 mb-4">试试其他关键词</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["租房", "工作", "华人", "二手"].map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer hover:bg-blue-100"
                onClick={() => setQuery(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              找到 <span className="font-semibold">{total}</span> 条结果
            </p>
          </div>

          {/* Results List */}
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
              >
                上一页
              </Button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (pageNum === 1 || pageNum === totalPages || (pageNum >= page - 1 && pageNum <= page + 1)) {
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === page ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        disabled={loading}
                      >
                        {pageNum}
                      </Button>
                    );
                  } else if (pageNum === page - 2 || pageNum === page + 2) {
                    return <span key={pageNum} className="px-2">...</span>;
                  }
                  return null;
                })}
              </div>

              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
              >
                下一页
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
