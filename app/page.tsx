import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Building2,
  Users,
  Briefcase,
  ShoppingBag,
  Home,
  Gift,
  Tag,
  BookOpen,
  Newspaper,
  ThumbsUp,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { LatestPosts } from "@/components/home/LatestPosts";
import { WelfarePosts } from "@/components/home/WelfarePosts";
import { QuickCategories } from "@/components/home/QuickCategories";
import { AdSidebar } from "@/components/home/AdSidebar";
import { cn } from "@/lib/utils";

const allCategories = [
  {
    slug: "local-news",
    name: "本土资讯",
    icon: Newspaper,
    color: "from-red-500 to-rose-600",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-500",
  },
  {
    slug: "chinese-community",
    name: "华人社区",
    icon: Users,
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-100 dark:bg-violet-900/30",
    iconColor: "text-violet-500",
  },
  {
    slug: "jobs",
    name: "招聘求职",
    icon: Briefcase,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-500",
  },
  {
    slug: "housing",
    name: "房屋租售",
    icon: Home,
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "text-emerald-500",
  },
  {
    slug: "marketplace",
    name: "同城交易",
    icon: ShoppingBag,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-500",
  },
  {
    slug: "recommendations",
    name: "好趣推荐",
    icon: ThumbsUp,
    color: "from-cyan-500 to-cyan-600",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    iconColor: "text-cyan-500",
  },
  {
    slug: "deals",
    name: "商家优惠",
    icon: Tag,
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    iconColor: "text-yellow-600",
  },
  {
    slug: "yellow-pages",
    name: "行业黄页",
    icon: BookOpen,
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    iconColor: "text-indigo-500",
  },
];

const features = [
  {
    icon: MapPin,
    title: "本地化服务",
    description: "专注北美各大城市，覆盖您生活的方方面面",
  },
  {
    icon: Users,
    title: "华人社区",
    description: "连接北美华人，共享本地生活经验与资讯",
  },
  {
    icon: ShoppingBag,
    title: "安全交易",
    description: "严格的审核机制，保障您的交易安全",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* 顶部横幅公告（静态） */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-4 py-3 text-center text-white">
        <p className="text-sm">
          🎉 欢迎来到美国华人同城！立即
          <Link href="/register" className="font-bold underline mx-1">注册</Link>
          发布您的第一条帖子
        </p>
      </div>

      {/* 分类导航栏 */}
      <section className="container mx-auto px-4 max-w-7xl">
        <CategoryGrid />
      </section>

      {/* Welfare Posts Section (3x3 grid) */}
      <section className="space-y-6">
        <WelfarePosts />
      </section>

      {/* 本土资讯双栏模块 - 当地事件 + 华人热点 */}
      <section className="container mx-auto px-4 max-w-7xl space-y-4">
        {/* 父级分类标题 */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900 dark:text-zinc-100">📌 本土资讯</span>
        </div>
        {/* 双栏布局 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 左栏：当地事件 */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
            {/* 标题行 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-zinc-100">📰 当地事件</h3>
              <Link href="/category/local-news" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                更多 →
              </Link>
            </div>
            {/* 帖子列表 */}
            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
              {[
                { title: "加州山火最新通报：已控制80%火势", sub: "当地事件", time: "1小时前" },
                { title: "纽约地铁票价明年将上涨至$3.25", sub: "当地事件", time: "3小时前" },
                { title: "德州暴风雪预警：本周末将降至零下", sub: "当地事件", time: "5小时前" },
                { title: "旧金山唐人街春节花车游行时间公布", sub: "当地事件", time: "8小时前" },
                { title: "芝加哥华人区新增免费停车场", sub: "当地事件", time: "昨天" },
                { title: "西雅图公立学校新增中文课程", sub: "当地事件", time: "2天前" },
              ].map((post, index) => (
                <Link key={index} href={`/posts/${index}`} className="block group px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="flex-1 text-sm font-semibold text-gray-900 dark:text-zinc-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-zinc-400">{post.sub}</span>
                    <span className="text-xs text-gray-400 dark:text-zinc-500">·</span>
                    <span className="text-xs text-gray-400 dark:text-zinc-500">{post.time}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 右栏：华人热点 */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
            {/* 标题行 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-zinc-100">🔥 华人热点</h3>
              <Link href="/category/local-news" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                更多 →
              </Link>
            </div>
            {/* 帖子列表 */}
            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
              {[
                { title: "全美华人春晚节目单公布，精彩纷呈", sub: "华人热点", time: "2小时前" },
                { title: "北美华人年度大会将在洛杉矶举办", sub: "华人热点", time: "4小时前" },
                { title: "华人青少年编程大赛报名开启", sub: "华人热点", time: "6小时前" },
                { title: "春节寄养宠物服务需求激增", sub: "华人热点", time: "昨天" },
                { title: "华人超市年货促销已经开始", sub: "华人热点", time: "昨天" },
                { title: "北美华人摄影展作品征集倒计时", sub: "华人热点", time: "3天前" },
              ].map((post, index) => (
                <Link key={index} href={`/posts/${index + 100}`} className="block group px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="flex-1 text-sm font-semibold text-gray-900 dark:text-zinc-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-zinc-400">{post.sub}</span>
                    <span className="text-xs text-gray-400 dark:text-zinc-500">·</span>
                    <span className="text-xs text-gray-400 dark:text-zinc-500">{post.time}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 华人社区 + 招聘求职 双栏模块 */}
      <section className="container mx-auto px-4 max-w-7xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 左栏：华人社区 */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-zinc-100">👥 华人社区</h3>
              <Link href="/category/chinese-community" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                更多 →
              </Link>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
              {[
                { title: "吐槽：湾区房东又涨租了，大家都涨了多少？", sub: "茶话吃瓜", time: "30分钟前" },
                { title: "求助：驾照过期了怎么续期？坐标加州", sub: "互助信息", time: "1小时前" },
                { title: "在美国生活十年的感悟，给新移民的建议", sub: "茶话吃瓜", time: "2小时前" },
                { title: "有人知道纽约哪里可以办中国签证吗？", sub: "互助信息", time: "3小时前" },
                { title: "曝光：法拉盛某搬家公司坐地起价", sub: "黑名单", time: "5小时前" },
                { title: "请问报税季找华人会计师大概多少钱？", sub: "互助信息", time: "6小时前" },
              ].map((post, index) => (
                <Link key={index} href={`/posts/${index + 200}`} className="block group px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="flex-1 text-sm font-semibold text-gray-900 dark:text-zinc-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-zinc-400">{post.sub}</span>
                    <span className="text-xs text-gray-400 dark:text-zinc-500">·</span>
                    <span className="text-xs text-gray-400 dark:text-zinc-500">{post.time}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 右栏：招聘求职 */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-zinc-100">💼 招聘求职</h3>
              <Link href="/category/jobs" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                更多 →
              </Link>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
              {[
                { title: "【急招】纽约中餐馆诚聘炒锅师傅，包吃住", sub: "招聘", time: "1小时前" },
                { title: "本人求职：会计专业，CPA持证，5年经验", sub: "求职", time: "2小时前" },
                { title: "湾区科技公司招聘中英双语客服", sub: "招聘", time: "3小时前" },
                { title: "洛杉矶美甲店招聘美甲师，有经验优先，包住", sub: "招聘", time: "4小时前" },
                { title: "求职：持CDL驾照，求长途货运工作", sub: "求职", time: "5小时前" },
                { title: "芝加哥仓库招聘包装工，$17/时，日结", sub: "招聘", time: "8小时前" },
              ].map((post, index) => (
                <Link key={index} href={`/posts/${index + 300}`} className="block group px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="flex-1 text-sm font-semibold text-gray-900 dark:text-zinc-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-zinc-400">{post.sub}</span>
                    <span className="text-xs text-gray-400 dark:text-zinc-500">·</span>
                    <span className="text-xs text-gray-400 dark:text-zinc-500">{post.time}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 房屋租售 + 同城交易 双栏模块 */}
      <section className="container mx-auto px-4 max-w-7xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 左栏：房屋租售 */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-zinc-100">🏠 房屋租售</h3>
              <Link href="/category/housing" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                更多 →
              </Link>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
              {[
                { title: "法拉盛两室一厅出租，近7号线地铁，拎包入住", sub: "房屋出租", time: "1小时前" },
                { title: "求租：波士顿一室一厅，预算$1500以内", sub: "房屋需求", time: "2小时前" },
                { title: "尔湾独立屋出售，好学区，4房3卫，带泳池", sub: "房屋出售", time: "3小时前" },
                { title: "曼哈顿中城studio转租，2月1日可入住", sub: "房屋出租", time: "5小时前" },
                { title: "休斯顿糖城新房出售，华人社区，交通便利", sub: "房屋出售", time: "8小时前" },
                { title: "西雅图求合租室友，男女不限，近UW", sub: "房屋需求", time: "昨天" },
              ].map((post, index) => (
                <Link key={index} href={`/posts/${index + 400}`} className="block group px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="flex-1 text-sm font-semibold text-gray-900 dark:text-zinc-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-zinc-400">{post.sub}</span>
                    <span className="text-xs text-gray-400 dark:text-zinc-500">·</span>
                    <span className="text-xs text-gray-400 dark:text-zinc-500">{post.time}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 右栏：同城交易 */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-zinc-100">🛍️ 同城交易</h3>
              <Link href="/category/marketplace" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                更多 →
              </Link>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
              {[
                { title: "全新iPhone 15 Pro Max转让，未拆封有凭证", sub: "闲置物品", time: "1小时前" },
                { title: "2020 Honda Civic低价出售，3万迈，无事故", sub: "二手车辆", time: "2小时前" },
                { title: "奶茶店旺铺转让，设备齐全可直接经营", sub: "生意转让", time: "4小时前" },
                { title: "搬家清仓：沙发茶几餐桌全套$200带走", sub: "闲置物品", time: "6小时前" },
                { title: "2018 Toyota Camry出售，车况极���，定期保养", sub: "二手车辆", time: "昨天" },
                { title: "免费赠送：宝宝衣服玩具一大箱，自取", sub: "闲置物品", time: "2天前" },
              ].map((post, index) => (
                <Link key={index} href={`/posts/${index + 500}`} className="block group px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="flex-1 text-sm font-semibold text-gray-900 dark:text-zinc-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-zinc-400">{post.sub}</span>
                    <span className="text-xs text-gray-400 dark:text-zinc-500">·</span>
                    <span className="text-xs text-gray-400 dark:text-zinc-500">{post.time}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 商家优惠 + 行业黄页 双栏模块 */}
      <section className="container mx-auto px-4 max-w-7xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 左栏：商家优惠 */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-zinc-100">🏷️ 商家优惠</h3>
              <Link href="/category/deals" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                更多 →
              </Link>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
              {[
                { title: "川菜馆开业酬宾，全场8折，每桌送招牌小菜", sub: "优惠活动", time: "2小时前" },
                { title: "华人超市周末特价：五花肉$2.99/磅", sub: "优惠活动", time: "3小时前" },
                { title: "美甲店新客优惠：首次到店全场7折", sub: "优惠活动", time: "5小时前" },
                { title: "华人驾校春季特惠：报名立减$100", sub: "优惠活动", time: "8小时前" },
                { title: "搬家公司开年促销，市内搬家$299起", sub: "优惠活动", time: "昨天" },
                { title: "中医诊所免费义诊活动，本周六限20名额", sub: "优惠活动", time: "2天前" },
              ].map((post, index) => (
                <Link key={index} href={`/posts/${index + 600}`} className="block group px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="flex-1 text-sm font-semibold text-gray-900 dark:text-zinc-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-zinc-400">{post.sub}</span>
                    <span className="text-xs text-gray-400 dark:text-zinc-500">·</span>
                    <span className="text-xs text-gray-400 dark:text-zinc-500">{post.time}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 右栏：行业黄页 */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-zinc-100">📖 行业黄页</h3>
              <Link href="/category/yellow-pages" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                更多 →
              </Link>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
              {[
                { title: "纽约王律师事务所·移民/车祸/房产纠纷", sub: "法律会计", time: "1小时前" },
                { title: "湾区李师傅装修·厨房浴室翻新·免费估价", sub: "建筑装修", time: "3小时前" },
                { title: "洛杉矶张医生家庭诊所·中英双语·接受保险", sub: "医疗健康", time: "5小时前" },
                { title: "芝加哥专业月嫂·持证上岗·经验丰富", sub: "家政服务", time: "8小时前" },
                { title: "休斯顿陈老师钢琴��学·考级辅导·上门授课", sub: "教育培训", time: "昨天" },
                { title: "达拉斯24小时机场接送·商务用车·长途包车", sub: "代跑接送", time: "2天前" },
              ].map((post, index) => (
                <Link key={index} href={`/posts/${index + 700}`} className="block group px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="flex-1 text-sm font-semibold text-gray-900 dark:text-zinc-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-zinc-400">{post.sub}</span>
                    <span className="text-xs text-gray-400 dark:text-zinc-500">·</span>
                    <span className="text-xs text-gray-400 dark:text-zinc-500">{post.time}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              全部最新
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              最新发布的优质内容
            </p>
          </div>
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors group"
          >
            查看全部
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <LatestPosts />
      </section>

      {/* Main Content Grid with Ad Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Posts Section - 3/4 width */}
        <div className="lg:col-span-3">
          {/* Additional content could go here if needed */}
        </div>

        {/* Ad Sidebar - 1/4 width */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <AdSidebar />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-12">
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />

          <div className="relative">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                为什么选择我们
              </h2>
              <p className="text-zinc-400 max-w-xl mx-auto">
                专为北美华人打造的生活服务平台
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="relative p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 hover:border-blue-500/50 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-12">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50 rounded-3xl" />

        <div className="relative text-center py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            准备好加入我们了吗？
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            立即注册，开始发布你的第一条帖子<br className="hidden md:block" />
            与北美华人共享本地生活
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button
                size="lg"
                className="h-12 px-8 text-base font-medium bg-white text-blue-600 hover:bg-blue-50 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                免费注册
              </Button>
            </Link>
            <Button
              size="lg"
              variant="ghost"
              className="h-12 px-8 text-base font-medium text-white hover:bg-white/10 transition-all duration-300"
            >
              了解更多
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
