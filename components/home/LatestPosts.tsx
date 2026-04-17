"use client";

import Link from "next/link";
import { MapPin, Clock, Eye, Briefcase, Home, ShoppingBag, Tag, Newspaper, Users, Gift, ThumbsUp, BookOpen, MoreHorizontal } from "lucide-react";

// 图标映射配置
const categoryIconMap: Record<string, { icon: any; gradient: string }> = {
  "本土资讯": { icon: Newspaper, gradient: "from-rose-500 to-red-600" },
  "华人社区": { icon: Users, gradient: "from-violet-500 to-purple-600" },
  "招聘求职": { icon: Briefcase, gradient: "from-sky-500 to-blue-600" },
  "房屋租售": { icon: Home, gradient: "from-emerald-500 to-green-600" },
  "同城交易": { icon: ShoppingBag, gradient: "from-amber-500 to-orange-600" },
  "福利放送": { icon: Gift, gradient: "from-pink-500 to-rose-600" },
  "好趣推荐": { icon: ThumbsUp, gradient: "from-teal-500 to-cyan-600" },
  "商家优惠": { icon: Tag, gradient: "from-yellow-500 to-amber-600" },
  "行业黄页": { icon: BookOpen, gradient: "from-indigo-500 to-blue-700" },
  "其他": { icon: MoreHorizontal, gradient: "from-gray-400 to-gray-600" },
};

function getCategoryGradient(category: string): string {
  const config = categoryIconMap[category];
  return config ? config.gradient : "from-gray-400 to-gray-600";
}

// Mock 帖子数据 - 6 条
const mockPosts = [
  {
    title: "【诚聘】湾区知名中餐厅招前厅主管·底薪+小费+包餐",
    description: "旧金山Sunset区正宗川菜馆，营业6年，口碑极佳，现诚招有经验的前厅管理人员一名",
    parentCategory: "招聘求职",
    subCategory: "招聘",
    state: "加利福尼亚",
    city: "旧金山湾区",
    time: "4小时前",
    views: 892,
    price: "$5,000/月"
  },
  {
    title: "西雅图Capitol Hill整套一室一厅出租·近地铁·允许养猫",
    description: "独立公寓，550sqft，全新装修，配齐家具，楼下有洗衣房，步行10分钟至Capitol Hill地铁站",
    parentCategory: "房屋租售",
    subCategory: "房屋出租",
    state: "华盛顿",
    city: "西雅图",
    time: "6小时前",
    views: 1456,
    price: "$1,850/月"
  },
  {
    title: "出售：2021年款MacBook Pro M1 13寸·保修至明��·非诚勿扰",
    description: "个人使用，成色9.5新，原装充电器，原装包装盒，因换新机出售",
    parentCategory: "同城交易",
    subCategory: "闲置物品",
    state: "纽约",
    city: "曼哈顿",
    time: "8小时前",
    views: 621,
    price: "$880"
  },
  {
    title: "免费赠送！IKEA宜家沙发一张·七成新·自提·波士顿Allston",
    description: "因搬家无法带走，宜家布艺三人沙发一张，灰色，自提。本周末前必须取走",
    parentCategory: "同城交易",
    subCategory: "闲置物品",
    state: "马萨诸塞",
    city: "波士顿",
    time: "今天 09:30",
    views: 2104,
    price: "免费"
  },
  {
    title: "【团购】芝加哥华人餐厅联合团购·满$50享8折优惠·限时三天",
    description: "10家口碑华人餐厅联合推出限时团购活动，覆盖川菜、粤菜、火锅、烤肉等多种风味",
    parentCategory: "商家优惠",
    subCategory: "团购打折",
    state: "伊利诺伊",
    city: "芝加哥",
    time: "昨天",
    views: 4892,
    price: ""
  },
  {
    title: "华人律师事务所招聘前台接待·中英双语·有经验优先",
    description: "要求中英文流利，熟练使用办公软件，提供医疗保险和带薪假期",
    parentCategory: "招聘求职",
    subCategory: "招聘",
    state: "新泽西",
    city: "爱迪生",
    time: "1天前",
    views: 567,
    price: "$18-22/时"
  }
];

export function LatestPosts() {
  return (
    <section className="container mx-auto px-4 max-w-7xl">
      {/* 自定义呼吸动画 */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.03); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* Posts List - 一行一条，左中右结构，黑白灰简约风格 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {mockPosts.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            暂无最新帖子
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {mockPosts.map((post, index) => {
              // 获取金钱字段
              const moneyValue = post.price;

              return (
                <Link
                  key={index}
                  href={`/posts/${index}`}
                  className="group block"
                >
                  <article className="relative flex items-center gap-4 p-4 hover:bg-gray-50 transition-all duration-200">
                    {/* 左侧：父级分类图标 - 渐变背景 + 白色图标 + 呼吸效果 */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-md overflow-hidden animate-pulse-slow bg-gradient-to-br ${getCategoryGradient(post.parentCategory)}`}>
                      {(() => {
                        const config = categoryIconMap[post.parentCategory];
                        if (!config) return null;
                        const Icon = config.icon;
                        return (
                          <Icon className="w-6 h-6 text-white relative z-10" />
                        );
                      })()}
                    </div>

                    {/* 中间：主信息区 */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                      {/* 第一行：标题 */}
                      <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-200">
                        {post.title}
                      </h3>

                      {/* 描述预览 - 一行截断 */}
                      {post.description && (
                        <p className="text-sm text-gray-500 truncate">
                          {post.description}
                        </p>
                      )}

                      {/* 第二行：元信息 */}
                      <div className="flex items-center gap-3 text-sm">
                        {/* 父级分类标签 - 灰色背景 */}
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                          {post.parentCategory}
                        </span>

                        {/* 子分类 - 灰色 */}
                        {post.subCategory && (
                          <span className="text-gray-400 text-xs">
                            {post.subCategory}
                          </span>
                        )}

                        {/* 地点 */}
                        <span className="flex items-center gap-1 text-gray-400 text-xs">
                          <MapPin className="w-3 h-3" />
                          {post.state} · {post.city}
                        </span>

                        {/* 时间 */}
                        <span className="flex items-center gap-1 text-gray-400 text-xs">
                          <Clock className="w-3 h-3" />
                          {post.time}
                        </span>

                        {/* 浏览数 */}
                        <span className="flex items-center gap-1 text-gray-400 text-xs">
                          <Eye className="w-3 h-3" />
                          {post.views.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* 右侧：价格/薪资等金钱属性 */}
                    {moneyValue && moneyValue !== "" && (
                      <div className="flex-shrink-0 text-right">
                        <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                          {moneyValue}
                        </span>
                      </div>
                    )}
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* 分页组件 - 黑白灰风格 */}
      <div className="mt-6 flex justify-center">
        <nav className="flex items-center gap-2">
          <button
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled
          >
            ← 上一页
          </button>

          <span className="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white rounded-md">1</span>

          <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
            2
          </button>

          <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
            下一页 →
          </button>
        </nav>
      </div>
    </section>
  );
}
