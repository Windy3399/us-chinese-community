"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { MapPin, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PostCard, PostCardSkeleton } from "@/components/post/PostCard";
import { Pagination, PaginationInfo } from "@/components/ui/Pagination";
import { cn } from "@/lib/utils";

interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  icon: string | null;
  sort_order: number;
}

interface Post {
  id: string;
  title: string;
  description?: string;
  state: string | null;
  city: string | null;
  thumbnail?: string | null;
  category_name?: string;
  category_slug?: string;
  username?: string;
  view_count?: number;
  is_sticky?: number;
  created_at: string;
}

const US_STATES = [
  { value: "", label: "全美" },
  { value: "California", label: "加利福尼亚" },
  { value: "New York", label: "纽约" },
  { value: "Texas", label: "得克萨斯" },
  { value: "New Jersey", label: "新泽西" },
  { value: "Illinois", label: "伊利诺伊" },
  { value: "Washington", label: "华盛顿" },
  { value: "Massachusetts", label: "马萨诸塞" },
  { value: "Pennsylvania", label: "宾夕法尼亚" },
  { value: "Florida", label: "佛罗里达" },
  { value: "Maryland", label: "马里兰" },
  { value: "Virginia", label: "弗吉尼亚" },
  { value: "Ohio", label: "俄亥俄" },
  { value: "Georgia", label: "乔治亚" },
  { value: "Michigan", label: "密歇根" },
  { value: "North Carolina", label: "北卡罗来纳" },
  { value: "Other", label: "其他" },
];

const CATEGORY_CONFIGS: Record<string, { name: string; description: string; icon: string; color: string }> = {
  "local-news": {
    name: "本土资讯",
    description: "了解当地最新动态，本土新闻、活动信息",
    icon: "📰",
    color: "from-red-500 to-rose-600",
  },
  "chinese-community": {
    name: "华人社区",
    description: "连接华人同胞，分享生活点滴，互助交流",
    icon: "👥",
    color: "from-violet-500 to-purple-600",
  },
  "jobs": {
    name: "招聘求职",
    description: "找工作、招人才，海量职位等你来",
    icon: "💼",
    color: "from-blue-500 to-blue-600",
  },
  "housing": {
    name: "房屋租售",
    description: "租房、买房、卖房，找到你的理想居所",
    icon: "🏠",
    color: "from-emerald-500 to-green-600",
  },
  "marketplace": {
    name: "同城交易",
    description: "闲置物品、二手车辆，生意转让信息",
    icon: "🛒",
    color: "from-orange-500 to-orange-600",
  },
  "welfare": {
    name: "福利放送",
    description: "各种优惠福利信息，省钱攻略",
    icon: "🎁",
    color: "from-pink-500 to-pink-600",
  },
  "recommendations": {
    name: "好趣推荐",
    description: "发现有趣的地方、好吃的东西、好看的内容",
    icon: "👍",
    color: "from-cyan-500 to-cyan-600",
  },
  "deals": {
    name: "商家优惠",
    description: "商家促销信息，专属优惠折扣",
    icon: "🏷️",
    color: "from-yellow-500 to-yellow-600",
  },
  "yellow-pages": {
    name: "行业黄页",
    description: "各类商家服务信息，找到靠谱的服务商",
    icon: "📖",
    color: "from-indigo-500 to-indigo-600",
  },
  "others": {
    name: "其他",
    description: "无法分类的信息都放在这里",
    icon: "📌",
    color: "from-zinc-500 to-zinc-600",
  },
};

// Mock subcategories (in real app, would come from API)
const SUBCATEGORIES: Record<string, { slug: string; name: string; color: string }[]> = {
  "local-news": [
    { slug: "local-events", name: "当地事件", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    { slug: "chinese-news", name: "华人热点", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  ],
  "chinese-community": [
    { slug: "casual-chat", name: "茶话吃瓜", color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
    { slug: "mutual-help", name: "互助信息", color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
    { slug: "blacklist", name: "黑名单", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  ],
  "jobs": [
    { slug: "hiring", name: "招聘", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    { slug: "job-seeking", name: "求职", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  ],
  "housing": [
    { slug: "for-rent", name: "房屋出租", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
    { slug: "housing-wanted", name: "房屋需求", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
    { slug: "for-sale", name: "房屋出售", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  ],
  "marketplace": [
    { slug: "used-items", name: "闲置物品", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
    { slug: "vehicles", name: "二手车辆", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
    { slug: "business-transfer", name: "生意转让", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  ],
  "yellow-pages": [
    { slug: "food-dining", name: "美食餐饮", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    { slug: "home-services", name: "家政服务", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" },
    { slug: "errands", name: "代跑接送", color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
    { slug: "beauty", name: "美容美发", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" },
    { slug: "entertainment", name: "休闲娱乐", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
    { slug: "healthcare", name: "医疗健康", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" },
    { slug: "legal-accounting", name: "法律会计", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" },
    { slug: "finance", name: "金融保险", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
    { slug: "education", name: "教育培训", color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
    { slug: "pets", name: "宠物服务", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
    { slug: "yp-other", name: "其他", color: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800/30 dark:text-zinc-400" },
  ],
};

// Mock posts for demo (when API not available)
const MOCK_POSTS: Post[] = [
  {
    id: "1",
    title: "洛杉矶豪华公寓出租 - 近华人区，包水电家具",
    state: "California",
    city: "洛杉矶",
    category_name: "房屋出租",
    category_slug: "for-rent",
    username: "房东老王",
    view_count: 1234,
    is_sticky: 1,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "高薪诚聘！洛杉矶中餐厅招服务员和后厨",
    state: "California",
    city: "洛杉矶",
    category_name: "招聘",
    category_slug: "hiring",
    username: "餐厅经理",
    view_count: 856,
    is_sticky: 0,
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "99新特斯拉 Model 3 低价转让",
    state: "New York",
    city: "纽约市",
    category_name: "二手车辆",
    category_slug: "vehicles",
    username: "车主小李",
    view_count: 2341,
    is_sticky: 0,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    title: "旧金山台湾美食餐厅新店开业，全场8折！",
    state: "California",
    city: "旧金山",
    category_name: "美食餐饮",
    category_slug: "food-dining",
    username: "餐厅老板",
    view_count: 567,
    is_sticky: 0,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    title: "法拉盛超大主卧招室友，包水电网",
    state: "New York",
    city: "法拉盛",
    category_name: "房屋出租",
    category_slug: "for-rent",
    username: "室友小张",
    view_count: 432,
    is_sticky: 0,
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    title: "Costco 代购服务上线！每周往返，代购费低至5%",
    state: "California",
    city: "尔湾",
    category_name: "代跑接送",
    category_slug: "errands",
    username: "代购达人",
    view_count: 789,
    is_sticky: 0,
    created_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
  },
];

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [selectedState, setSelectedState] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const totalPages = Math.ceil(total / 20);

  const config = CATEGORY_CONFIGS[slug] || {
    name: "分类",
    description: "",
    icon: "📌",
    color: "from-zinc-500 to-zinc-600",
  };

  const subcategories = SUBCATEGORIES[slug] || [];

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", currentPage.toString());
      params.set("limit", "20");
      if (selectedState) params.set("state", selectedState);

      const response = await fetch(`/api/posts?${params.toString()}`);
      const data = await response.json();

      if (response.ok && data.data) {
        setPosts(data.data.posts || []);
        setTotal(data.data.total || 0);
      } else {
        // Use mock data when API fails
        setPosts(MOCK_POSTS);
        setTotal(MOCK_POSTS.length);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      // Use mock data on error
      setPosts(MOCK_POSTS);
      setTotal(MOCK_POSTS.length);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedState]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSubcategoryClick = (subSlug: string) => {
    setSelectedSubcategory(selectedSubcategory === subSlug ? null : subSlug);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r p-6 sm:p-8" style={{
        background: `linear-gradient(to right, var(--tw-gradient-stops))`
      }}>
        <div className={`absolute inset-0 bg-gradient-to-r ${config.color} opacity-10`} />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{config.icon}</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              {config.name}
            </h1>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400">
            {config.description}
          </p>
        </div>
      </div>

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            子分类
          </h2>
          <div className="flex flex-wrap gap-2">
            {subcategories.map((sub) => (
              <button
                key={sub.slug}
                onClick={() => handleSubcategoryClick(sub.slug)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                  selectedSubcategory === sub.slug
                    ? sub.color
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                )}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-zinc-400" />
          <Select value={selectedState} onValueChange={(value) => {
            setSelectedState(value || "");
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-40 border-0 bg-transparent shadow-none focus:ring-0">
              <SelectValue placeholder="选择州" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((state) => (
                <SelectItem key={state.value} value={state.value}>
                  {state.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-zinc-500">
          {isLoading ? "加载中..." : `共 ${total} 条帖子`}
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-3">
        {isLoading ? (
          <>
            {[...Array(6)].map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Pagination */}
      {!isLoading && posts.length > 0 && (
        <div className="flex flex-col items-center gap-4 py-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
          <PaginationInfo
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
          />
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Cute illustration */}
      <div className="relative mb-6">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center">
          <span className="text-6xl">📭</span>
        </div>
        <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center animate-bounce">
          <span className="text-2xl">?</span>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
        暂无帖子
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center mb-6 max-w-sm">
        这里还没有帖子，快来发布第一条吧！分享你的信息给社区成员
      </p>
      
      <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
        发布帖子
      </Button>
    </div>
  );
}
