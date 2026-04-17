"use client";

import Link from "next/link";
import { Gift, Clock, MapPin, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// 福利放送模拟数据 - 9个帖子 (3x3)
const welfarePosts = [
  {
    id: "w1",
    title: "限时优惠！Costco会员卡8折出售，仅限本周",
    description: "现有Costco金牌会员卡转让，有效期至2027年，价格优惠，转让费$50。",
    category: { name: "福利放送", slug: "welfare", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" },
    location: { state: "California", city: "Los Angeles" },
    time: "1小时前",
    views: 2341,
    isHot: true,
  },
  {
    id: "w2",
    title: "免费领取！华人超市$50购物券限量发放",
    description: "新用户注册即可获得$50购物券，可在合作华人超市使用，数量有限先到先得。",
    category: { name: "福利放送", slug: "welfare", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" },
    location: { state: "New York", city: "Flushing" },
    time: "3小时前",
    views: 5621,
    isHot: true,
  },
  {
    id: "w3",
    title: "回国特价机票！洛杉矶-北京往返$599起",
    description: "暑期特价，限时优惠，包含两件托运行李，改签政策灵活。",
    category: { name: "福利放送", slug: "welfare", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" },
    location: { state: "California", city: "Los Angeles" },
    time: "5小时前",
    views: 8923,
    isHot: true,
  },
  {
    id: "w4",
    title: "新店开业！奶茶买一送一，持续一周",
    description: "尔湾新开的奶茶店开业庆典，所有饮品买一送一，欢迎品尝。",
    category: { name: "福利放送", slug: "welfare", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" },
    location: { state: "California", city: "Irvine" },
    time: "8小时前",
    views: 1234,
    isHot: false,
  },
  {
    id: "w5",
    title: "免费英语课程！社区中心提供成人英语培训",
    description: "政府资助项目，完全免费，每周二四六晚上7-9点，提供 childcare。",
    category: { name: "福利放送", slug: "welfare", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" },
    location: { state: "Texas", city: "Houston" },
    time: "12小时前",
    views: 3456,
    isHot: false,
  },
  {
    id: "w6",
    title: "华人诊所体检套餐优惠价$99，原价$200",
    description: "包含全面体检、血常规、心电图等，专业医生团队，中英双语服务。",
    category: { name: "福利放送", slug: "welfare", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" },
    location: { state: "New York", city: "New York City" },
    time: "1天前",
    views: 4567,
    isHot: false,
  },
  {
    id: "w7",
    title: "手机卡免费送！首月$20含无限流量",
    description: "新用户限时福利，首月免费，之后$20/月无限流量，无合约限制。",
    category: { name: "福利放送", slug: "welfare", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" },
    location: { state: "Washington", city: "Seattle" },
    time: "1天前",
    views: 6789,
    isHot: false,
  },
  {
    id: "w8",
    title: "二手车低价出售！2018 Toyota Camry $8000",
    description: "车况良好，里程8万英里，定期保养，适合通勤，可议价。",
    category: { name: "福利放送", slug: "welfare", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" },
    location: { state: "Florida", city: "Miami" },
    time: "2天前",
    views: 7890,
    isHot: false,
  },
  {
    id: "w9",
    title: "免费法律咨询！华人律师免费解答移民问题",
    description: "每周六上午10点-12点，专业移民律师免费咨询，需提前预约。",
    category: { name: "福利放送", slug: "welfare", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" },
    location: { state: "Massachusetts", city: "Boston" },
    time: "2天前",
    views: 2345,
    isHot: false,
  },
];

export function WelfarePosts() {
  return (
    <section className="container mx-auto px-4 max-w-7xl space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">🎁</span>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          平台专属福利
        </h2>
        {/* 更多福利链接 */}
        <Link href="/category/welfare" className="ml-auto">
          <Badge variant="secondary" className="text-sm cursor-pointer px-3 py-1">
            更多福利
          </Badge>
        </Link>
      </div>

      {/* 3x3 Grid Layout - 简洁列表风格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {welfarePosts.map((post, index) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="group"
          >
            <article className="relative flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800/50 transition-all duration-300">
              {/* 火爆标签（浅红底 + 深红字）- 放在卡片右上角 */}
              {post.isHot && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-medium shadow-sm border border-red-200">
                    🔥 火爆
                  </div>
                </div>
              )}

              {/* 标题 - 固定宽度确保与赠送产品标签对齐 */}
              <h3 className="flex-1 min-w-0 text-base font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-200 leading-relaxed" style={{ minWidth: '80px', maxWidth: '140px' }}>
                {post.title}
              </h3>

              {/* 子标签：赠送产品（灰色字体，无背景） */}
              <span className="shrink-0 text-zinc-500 text-sm font-medium w-[70px]">
                [赠送产品]
              </span>

              {/* 城市 */}
              <span className="flex items-center gap-1.5 text-sm text-zinc-500 shrink-0 w-[80px]" title={post.location.state}>
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{post.location.city}</span>
              </span>

              {/* 时间 */}
              <span className="flex items-center gap-1.5 text-sm text-zinc-500 shrink-0 w-[80px]">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{post.time}</span>
              </span>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
