"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  Home,
  Pin,
  MapPin,
  Clock,
  Eye,
  Share2,
  Bookmark,
  ArrowLeft,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ContactCard } from "@/components/post/ContactCard";
import { ImageViewer, ImagePlaceholder } from "@/components/post/ImageViewer";
import { CommentSection } from "@/components/post/CommentSection";

interface PostImage {
  id: number;
  image_url: string;
  sort_order: number;
}

interface PostDetail {
  id: string;
  user_id: string;
  category_id: number | null;
  title: string;
  description: string;
  state: string | null;
  city: string | null;
  phone: string | null;
  wechat: string | null;
  status: string;
  is_sticky: number;
  view_count: number;
  extra_fields: string | null;
  created_at: string;
  updated_at: string;
  username: string;
  category_name: string;
  category_slug: string;
  images: PostImage[];
}

const CATEGORY_CONFIGS: Record<string, { name: string; icon: string; color: string }> = {
  "local-news": { name: "本土资讯", icon: "📰", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  "chinese-community": { name: "华人社区", icon: "👥", color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
  "jobs": { name: "招聘求职", icon: "💼", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  "housing": { name: "房屋租售", icon: "🏠", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  "marketplace": { name: "同城交易", icon: "🛒", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  "welfare": { name: "福利放送", icon: "🎁", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" },
  "recommendations": { name: "好趣推荐", icon: "👍", color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
  "deals": { name: "商家优惠", icon: "🏷️", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-800/30 dark:text-yellow-400" },
  "yellow-pages": { name: "行业黄页", icon: "📖", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" },
  "others": { name: "其他", icon: "📌", color: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800/30 dark:text-zinc-400" },
};

// Mock post data for demo
const MOCK_POST: PostDetail = {
  id: "1",
  user_id: "user123",
  category_id: 1,
  title: "洛杉矶豪华公寓出租 - 近华人区，包水电家具",
  description: `🏠 房源介绍

位于洛杉矶华人区核心地段，交通便利，周边生活设施齐全。

✨ 房屋亮点

• 面积：1200平方英尺（约110平方米）
• 户型：2室2卫1厅
• 楼层：高层，采光极佳
• 装修：精装修，家具齐全
• 设施：中央空调、洗衣机、冰箱、热水器

📍 位置

• 地址：123 Main Street, Los Angeles, CA
• 附近：超市、餐厅、药店、银行
• 交通：步行5分钟到地铁站

💰 租金

$2,500/月（包含水电网费）

📞 联系方式

有意者请电话或微信联系，看房需提前预约。

免责声明：本平台仅提供信息展示，不对信息真实性负责，请自行核实。`,
  state: "California",
  city: "洛杉矶",
  phone: "+1 626-888-8888",
  wechat: "LA_Housing",
  status: "active",
  is_sticky: 1,
  view_count: 1234,
  extra_fields: JSON.stringify({ price: "$2,500/月", bedrooms: 2, bathrooms: 2, area: "110㎡" }),
  created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  username: "房东老王",
  category_name: "房屋出租",
  category_slug: "for-rent",
  images: [
    { id: 1, image_url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", sort_order: 1 },
    { id: 2, image_url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", sort_order: 2 },
    { id: 3, image_url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800", sort_order: 3 },
    { id: 4, image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800", sort_order: 4 },
  ],
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/posts/${id}`);
      const data = await response.json();

      if (response.ok && data.data) {
        setPost(data.data);
      } else {
        // Use mock data when API fails
        setPost(MOCK_POST);
      }
    } catch (err) {
      console.error("Failed to fetch post:", err);
      // Use mock data on error
      setPost(MOCK_POST);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-zinc-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            帖子不存在或已下架
          </h2>
          <p className="text-zinc-500 mb-6">{error}</p>
          <Link href="/">
            <Button>返回首页</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isSticky = post.is_sticky === 1;
  const categoryConfig = CATEGORY_CONFIGS[post.category_slug] || CATEGORY_CONFIGS.others;
  let extraFields: Record<string, string> = {};
  try {
    if (post.extra_fields) {
      extraFields = JSON.parse(post.extra_fields);
    }
  } catch (e) {
    // ignore parse errors
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回首页
      </Link>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Content - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sticky Badge */}
          {isSticky && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 w-fit">
              <Pin className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                置顶帖子
              </span>
            </div>
          )}

          {/* Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight mb-4">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
              {/* Category */}
              <Link
                href={`/category/${post.category_slug}`}
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium transition-opacity hover:opacity-80",
                  categoryConfig.color
                )}
              >
                {categoryConfig.icon} {post.category_name}
              </Link>

              {/* Location */}
              {(post.state || post.city) && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {[post.state, post.city].filter(Boolean).join(" · ")}
                </span>
              )}

              {/* Time */}
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDate(post.created_at)}
              </span>

              {/* Views */}
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.view_count + 1} 次浏览
              </span>
            </div>
          </div>

          {/* Images */}
          {post.images && post.images.length > 0 ? (
            <ImageViewer images={post.images} />
          ) : (
            <ImagePlaceholder className="w-full" />
          )}

          {/* Description */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              详细信息
            </h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {post.description}
              </p>
            </div>
          </div>

          {/* Extra Fields */}
          {Object.keys(extraFields).length > 0 && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                其他信息
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.entries(extraFields).map(([key, value]) => (
                  <div
                    key={key}
                    className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50"
                  >
                    <p className="text-xs text-zinc-500 mb-1 capitalize">{key}</p>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Share & Bookmark */}
          <div className="flex items-center justify-between py-4 border-t border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                分享
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Bookmark className="w-4 h-4" />
                收藏
              </Button>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              ⚠️ 温馨提示：本平台仅提供信息展示，请自行核实信息真实性，谨防诈骗。
            </p>
          </div>

          {/* Comment Section - 仅华人社区分类显示 */}
          {post.category_slug === "chinese-community" && (
            <CommentSection postId={post.id} />
          )}
        </div>

        {/* Right Sidebar - 1/3 */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-4">
            <ContactCard
              username={post.username}
              phone={post.phone}
              wechat={post.wechat}
              createdAt={post.created_at}
              viewCount={post.view_count}
            />

            {/* Safety Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-2xl p-5 border border-blue-100 dark:border-blue-800/50">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                安全交易提示
              </h3>
              <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  建议当面交易，优先选择公共场所
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  不要轻易转账给陌生人
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  核实对方身份信息
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  遇到可疑情况请及时报警
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
