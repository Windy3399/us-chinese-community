# US Chinese Community - 项目需求文档

## 📋 项目概述

**项目名称**: US Chinese Community (美国华人同城)  
**项目类型**: 北美华人社区生活服务平台  
**技术栈**: Next.js 15 + TypeScript + TailwindCSS + Cloudflare Workers + D1 + KV + R2  
**部署目标**: Cloudflare Pages (Serverless)  
**开发状态**: ✅ 核心功能已完成，待部署

---

## 🎯 项目定位

北美华人一站式生活服务平台，专注为华人提供：
- 📰 本地资讯与新闻
- 🏠 房屋租售与求租
- 💼 招聘求职信息
- 🛍️ 同城二手交易
- 🏪 商家优惠与黄页
- 👥 华人社区互动

---

## 📊 核心功能模块

### 1. 用户系统 (Authentication & Users)
**状态**: ✅ 已完成

#### 功能特性
- 用户注册（邮箱 + 密码，PBKDF2 加密）
- 用户登录（JWT Token，7天有效期）
- 自动登录状态保持
- 用户登出
- 权限分级：`user`（普通用户）和 `admin`（管理员）
- 用户资料查看

#### 数据库表: `users`
```sql
- id (TEXT PRIMARY KEY)
- username (TEXT UNIQUE)
- email (TEXT UNIQUE)
- password_hash (TEXT)
- role (user|admin)
- is_banned (0|1)
- daily_post_count (今日发帖数限制)
- last_post_date (最后发帖日期)
- daily_comment_count (今日评论数限制)
- last_comment_date (最后评论日期)
- created_at, updated_at
```

#### API 路由
| 路由 | 方法 | 功能 | 权限 |
|------|------|------|------|
| `/api/auth/register` | POST | 注册 | 公开 |
| `/api/auth/login` | POST | 登录 | 公开 |
| `/api/auth/logout` | POST | 登出 | 登录用户 |
| `/api/auth/me` | GET | 获取当前用户信息 | 登录用户 |

---

### 2. 分类系统 (Categories)
**状态**: ✅ 已完成

#### 8 大主分类
| Slug | 名称 | 图标 | 描述 |
|------|------|------|------|
| `local-news` | 本土资讯 | 📰 | 当地新闻与华人热点 |
| `chinese-community` | 华人社区 | 👥 | 茶话吃瓜、互助信息、黑名单 |
| `jobs` | 招聘求职 | 💼 | 招聘信息与求职简历 |
| `housing` | 房屋租售 | 🏠 | 租房、买房、求租、求购 |
| `marketplace` | 同城交易 | 🛍️ | 二手物品、车辆、生意转让 |
| `recommendations` | 好趣推荐 | 👍 | 本地好店推荐 |
| `deals` | 商家优惠 | 🏷️ | 优惠活动、折扣信息 |
| `yellow-pages` | 行业黄页 | 📖 | 法律、装修、医疗、教育等 |

#### 子分类示例
- **华人社区** → 茶话吃瓜、互助信息、曝光维权、黑名单
- **房屋租售** → 房屋出租、房屋出售、房屋求租、房屋求购
- **同城交易** → 闲置物品、二手车辆、生意转让、免费赠送

#### 数据库表: `categories`
```sql
- id (INTEGER PRIMARY KEY AUTOINCREMENT)
- name (分类名称)
- slug (URL 友好标识符)
- parent_id (父分类 ID，NULL 表示主分类)
- icon (图标)
- sort_order (排序权重)
- is_admin_only (仅管理员可见)
- created_at
```

#### API 路由
| 路由 | 方法 | 功能 |
|------|------|------|
| `/api/categories` | GET | 获取所有分类（树形结构） |

---

### 3. 帖子系统 (Posts)
**状态**: ✅ 已完成

#### 帖子状态流程
```
pending (待审核) → active (已发布) → expired (已过期)
                   ↘ rejected (已拒绝)
```

#### 帖子字段
- **基本信息**: 标题、描述、分类、用户ID
- **位置信息**: 州(state)、城市(city)
- **联系方式**: 电话(phone)、微信(wechat)
- **展示设置**: 置顶(is_sticky)、置��顺序(sticky_order)
- **数据统计**: 查看量(view_count)
- **时间管理**: 过期时间(expires_at)，默认1年
- **动态字段**: extra_fields (JSON，存储分类特有字段)

#### 发帖限制规则
- 普通用户：每日最多 15 帖
- 管理员：无限制
- 每日重置时间：UTC 0 点（按 last_post_date 判断）

#### 数据库表: `posts`
```sql
- id (TEXT PRIMARY KEY)
- user_id (外键 → users.id)
- category_id (外键 → categories.id)
- title, description
- state, city (地理位置)
- phone, wechat (联系方式)
- status (pending|active|rejected|expired)
- is_sticky, sticky_order (置顶)
- extra_fields (JSON 扩展字段)
- view_count (浏览计数)
- expires_at (过期时间)
- created_at, updated_at
```

#### 数据库表: `post_images`
```sql
- id (INTEGER PRIMARY KEY AUTOINCREMENT)
- post_id (外键 → posts.id)
- image_url (R2 存储地址)
- sort_order (排序)
```

#### API 路由
| 路由 | 方法 | 功能 | 权限 |
|------|------|------|------|
| `/api/posts` | GET | 获取帖子列表（分页、筛选） | 公开 |
| `/api/posts` | POST | 创建新帖 | 登录用户 |
| `/api/posts/[id]` | GET | 获取帖子详情 | 公开 |
| `/api/posts/[id]` | PATCH | 更新帖子 | 作者或管理员 |
| `/api/posts/[id]` | DELETE | 删除帖子 | 作者或管理员 |
| `/api/my-posts` | GET | 我的帖子 | 登录用户 |
| `/api/upload` | POST | 上传图片 | 登录用户 |

---

### 4. 评论系统 (Comments)
**状态**: ✅ 已完成

#### 数据库表: `comments`
```sql
- id (TEXT PRIMARY KEY)
- post_id (外键 → posts.id，级联删除)
- user_id (外键 → users.id)
- content (评论内容)
- created_at
```

#### API 路由
| 路由 | 方法 | 功能 |
|------|------|------|
| `/api/posts/[id]/comments` | GET | 获取帖子评论 |
| `/api/posts/[id]/comments` | POST | 发表评论 | 登录用户 |

---

### 5. 公告系统 (Announcements)
**状态**: ✅ 已完成

#### 数据库表: `notices`
```sql
- id (INTEGER PRIMARY KEY AUTOINCREMENT)
- title (公告标题)
- content (公告内容)
- is_active (是否显示)
- created_at
```

#### API 路由
| 路由 | 方法 | 功能 |
|------|------|------|
| `/api/announcement` | GET | 获取最新公告 |

---

### 6. 广告系统 (Ads)
**状态**: ✅ 已完成

#### 广告位位置
- 首页侧边栏 (`position: sidebar`)
- 分类页面顶部 (`position: category_top`)
- 帖子详情页侧边 (`position: post_sidebar`)
- 浮动横幅 (`position: banner`)

#### 数据库表: `ads`
```sql
- id (INTEGER PRIMARY KEY AUTOINCREMENT)
- category_id (可选，按分类展示)
- position (广告位标识)
- title (广告标题)
- image_url (R2 存储)
- link_url (跳转链接)
- is_active (是否启用)
- is_global (是否全局)
- priority (排序优先级)
- created_at
```

#### API 路由
| 路由 | 方法 | 功能 |
|------|------|------|
| `/api/ads` | GET | 获取广告列表（按位置筛选） |
| `/api/admin/ads` | GET | 管理端：获取所有广告 | Admin |
| `/api/admin/ads` | POST | 管理端：创建广告 | Admin |
| `/api/admin/ads/[id]` | PATCH | 管理端：更新广告 | Admin |
| `/api/admin/ads/[id]` | DELETE | 管理端：删除广告 | Admin |

---

### 7. 后台管理系统 (Admin Portal)
**状态**: ✅ 已完成

#### 管理页面路由 (`app/(admin)/portal_v2_xyz/`)
| 页面 | 路径 | 功能 |
|------|------|------|
| 仪表盘 | `/admin/portal_v2_xyz` | 数据统计概览 |
| 帖子管理 | `/admin/portal_v2_xyz/posts` | 审核、置顶、拒绝、删除 |
| 用户管理 | `/admin/portal_v2_xyz/users` | 封禁、解封、角色分配 |
| 广告管理 | `/admin/portal_v2_xyz/ads` | 广告 CRUD |
| 公告管理 | `/admin/portal_v2_xyz/notices` | 公告 CRUD |

#### 管理 API 路由
| 路由 | 方法 | 功能 |
|------|------|------|
| `/api/admin/stats` | GET | 统计数据（用户数、帖子数等） |
| `/api/admin/posts` | GET | 获取所有帖子（筛选、分页） |
| `/api/admin/posts/[id]/review` | PATCH | 审核帖子（approve/reject） |
| `/api/admin/posts/[id]/sticky` | PATCH | 置顶/取消置顶 |
| `/api/admin/users` | GET | 获取用户列表 |
| `/api/admin/users/[id]/ban` | PATCH | 封禁/解封用户 |
| `/api/admin/ads` | GET/POST/PATCH/DELETE | 广告管理 |
| `/api/admin/notices` | GET/POST/PATCH/DELETE | 公告管理 |
| `/api/admin/kv` | GET/POST | KV 配置管理 |

---

### 8. 搜索功能 (Search)
**状态**: ✅ 已完成

#### 搜索范围
- 帖子标题
- 帖子描述
- 用户昵称
- 城市、州

#### API 路由
| 路由 | 方法 | 功能 |
|------|------|------|
| `/api/search` | GET | 关键词搜索 |

---

### 9. 汇率查询 (Exchange Rate)
**状态**: ✅ 已完成

#### API 路由
| 路由 | 方法 | 功能 |
|------|------|------|
| `/api/exchange-rate` | GET | 获取实时汇率 |

---

### 10. Turnstile 人机验证
**状态**: ✅ 集成完成

#### 配置
- 库: `@marsidev/react-turnstile`
- 环境变量: `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`
- 场景: 注册、登录、发帖等敏感操作

---

## 🗄️ 数据库设计

### D1 Database (Cloudflare)
- **Database Name**: `ushrh`
- **Database ID**: `3097c546-b342-4283-ac03-44d99967b012`

### 表结构总览
```
users (6 个索引)
categories (2 个索引)
posts (5 个索引)
post_images (无额外索引)
comments (1 个索引)
ads (无额外索引)
notices (无额外索引)
kv_store (主键索引)
```

### 关键索引
```sql
-- Posts
idx_posts_status
idx_posts_category_id
idx_posts_user_id
idx_posts_expires_at
idx_posts_is_sticky

-- Comments
idx_comments_post_id

-- Categories
idx_categories_parent_id
```

---

## ☁️ Cloudflare 资源配置

### 1. D1 Database (SQLite)
- **名称**: `ushrh`
- **ID**: `3097c546-b342-4283-ac03-44d99967b012`
- **用途**: 存储核心业务数据

### 2. KV Namespace (Key-Value)
- **名称**: `ushrh`
- **ID**: `a513ab547fd2462591408cda67acec2c`
- **用途**: 站点配置、会话缓存

### 3. R2 Bucket (对象存储)
- **名称**: `ushrh`
- **用途**: 存储用户上传的图片
- **访问域名**: `https://pub-d7190d858f4f4f4c9d7d47c40a9e1f09.r2.dev`

---

## 🔐 环境变量配置

### 必需变量
```env
# JWT 密钥（至少 32 字符）
JWT_SECRET=K7mN9pQrStUvWxYzA1b2c3D4e5F6g7H8i9J0kL1mN2oP3qR4sT5uV6wX7yZ8

# Turnstile Cloudflare
TURNSTILE_SITE_KEY=your_site_key
TURNSTILE_SECRET_KEY=your_secret_key

# 应用 URL
NEXT_PUBLIC_APP_URL=https://your-site.pages.dev
```

### 可选变量
```env
# 管理员邮箱（多个用逗号分隔）
ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

---

## 📁 项目代码结构

```
us-chinese-community/
├── app/                          # Next.js App Router
│   ├── (admin)/                  # 管理后台（需登录+管理员权限）
│   │   └── portal_v2_xyz/
│   │       ├── page.tsx          # 仪表盘
│   │       ├── layout.tsx        # 后台布局（侧边栏）
│   │       ├── posts/            # 帖子管理
│   │       │   ├── page.tsx
│   │       │   └── components/
│   │       │       ├── PostTable.tsx
│   │       │       ├── ReviewModal.tsx
│   │       │       ├── BulkActionBar.tsx
│   │       │       └── StatusFilter.tsx
│   │       ├── users/            # 用户管理
│   │       │   ├── page.tsx
│   │       │   └── components/
│   │       │       └── SearchBar.tsx
│   │       ├── ads/              # 广告管理
│   │       │   └── page.tsx
│   │       ├── notices/          # 公告管理
│   │       │   └── page.tsx
│   │       ├── dashboard/        # 数据统计
│   │       │   └── page.tsx
│   │       ├── types.ts          # 类型定义
│   │       └── components/
│   │           └── Sidebar.tsx   # 侧边导航栏
│   ├── (auth)/                   # 认证页面（未登录访问）
│   │   ├── layout.tsx
│   │   ├── login/page.tsx        # 登录页
│   │   └── register/page.tsx     # 注册页
│   ├── api/                      # API 路由（Cloudflare Workers）
│   │   ├── auth/                 # 认证 API
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── logout/
│   │   │   └── me/
│   │   ├── posts/                # 帖子 API
│   │   │   ├── route.ts          # 列表+创建
│   │   │   ├── [id]/             # 单个帖子
│   │   │   │   ├── route.ts
│   │   │   │   └── comments/     # 评论
│   │   │   ├── my-posts/         # 我的帖子
│   │   │   └── upload/           # 图片上传
│   │   ├── categories/           # 分类 API
│   │   ├── search/               # 搜索 API
│   │   ├── announcement/         # 公告 API
│   │   ├── ads/                  # 广告 API
│   │   ├── exchange-rate/        # 汇率 API
│   │   └── admin/                # 管理 API
│   │       ├── posts/
│   │       │   ├── route.ts      # 列表
│   │       │   ├── [id]/
│   │       │   │   ├── review/   # 审核
│   │       │   │   └── sticky/   # 置顶
│   │       │   └── components/...
│   │       ├── users/            # 用户管理
│   │       ├── ads/              # 广告管理
│   │       ├── notices/          # 公告管理
│   │       ├── stats/            # 统计数据
│   │       └── kv/               # KV 配置
│   ├── category/[slug]/          # 分类页面
│   ├── post/[id]/                # 帖子详情页
│   ├── search/                   # 搜索页面
│   ├── my-posts/                 # 我的帖子页面
│   ├── publish/                  # 发布帖子页面
│   ├── layout.tsx                # 全局布局
│   ├── page.tsx                  # 首页
│   ├── error.tsx                 # 错误页
│   └── not-found.tsx             # 404 页面
├── components/                   # 可复用组件
│   ├── ui/                       # shadcn UI 组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── layout/                   # 布局组件
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── AnnouncementBanner.tsx
│   ├── home/                     # 首页组件
│   │   ├── CategoryGrid.tsx
│   │   ├── LatestPosts.tsx
│   │   ├── WelfarePosts.tsx
│   │   ├── QuickCategories.tsx
│   │   └── AdSidebar.tsx
│   ├── providers/                # 状态管理 Provider
│   │   ├── AuthProvider.tsx
│   │   └── ThemeProvider.tsx
│   └── forms/                    # 表单组件
│       ├── PostForm.tsx
│       ├── LoginForm.tsx
│       └── RegisterForm.tsx
├── lib/                          # 工具库
│   ├── db.ts                     # 数据库操作封装
│   ├── auth.ts                   # JWT + 密码加密
│   ├── admin-auth.ts             # 管理员权限验证
│   ├── utils.ts                  # 通用工具函数
│   └── timezone.ts               # 时区处理
├── store/                        # 状态管理 (Zustand)
│   ├── auth-store.ts             # 认证状态
│   └── publish-store.ts          # 发布状态
├── types/                        # TypeScript 类型定义
│   └── index.ts                  # 核心类型（User, Post, Category...）
├── db/                           # 数据库脚本
│   ├── schema.sql                # 建表语句
│   └── seed.sql                  # 初始数据
├── public/                       # 静态资源
│   ├── images/
│   ├── favicon.ico
│   └── apple-touch-icon.png
├── .open-next/                   # OpenNext 适配器配置
│   └── cloudflare-templates/     # Workers 模板
├── open-next.config.ts           # OpenNext 配置
├── next.config.ts                # Next.js 配置
├── tailwind.config.ts            # Tailwind 配置
├── postcss.config.mjs            # PostCSS 配置
├── package.json                  # 依赖管理
├── tsconfig.json                 # TypeScript 配置
├── wrangler.toml                 # Cloudflare Workers 配置
├── .dev.vars                     # 开发环境变量
├── proxy.ts                      # 开发代理配置
├── _proxy.ts                     # 构建代理
└── README.md                     # 项目说明
```

---

## 🛠️ 技术栈详解

### 前端框架
- **Next.js 15** (App Router)
  - React 19
  - Server Components (默认)
  - Edge Runtime (API Routes)
  - 静态生成 + 服务端渲染混合

### UI 组件库
- **shadcn/ui** (基于 Radix UI + Tailwind)
  - Button, Card, Input, Dialog, Table...
  - 完全可定制，无障碍访问
- **Lucide React** (图标库)
- **Sonner** (Toast 通知)
- **Next Themes** (深色模式)

### 状态管理
- **Zustand** (轻量级全局状态)
  - `auth-store`: 用户登录状态
  - `publish-store`: 发帖流程状态

### 表单处理
- **React Hook Form** + **Zod** (类型安全验证)
- **@base-ui/react** (表单控件)

### 样式方案
- **TailwindCSS 4** (原子化 CSS)
- **tw-animate-css** (动画扩展)
- **clsx + tailwind-merge** (条件类名)

### 数据库与存储
- **Cloudflare D1** (SQLite 兼容)
- **Cloudflare KV** (键值缓存)
- **Cloudflare R2** (图片对象存储)

### 后端运行时
- **Cloudflare Workers** (Serverless)
- **@cloudflare/next-on-pages** (Next.js → Pages 适配器)
- **OpenNext** (构建工具)

### 安全与认证
- **jose** (JWT 签名与验证)
- **Web Crypto API** (PBKDF2 密码哈希)
- **HTTP-only Cookies** (Token 存储)
- **Cloudflare Turnstile** (人机验证)

### 开发工具
- **TypeScript** (类型检查)
- **ESLint** (代码规范)
- **browser-image-compression** (图片压缩)

---

## 🚀 部署架构

### Cloudflare Pages + Workers

```
用户请求 → Cloudflare CDN → Cloudflare Pages
                                  ↓
                        Static Files (HTML/CSS/JS)
                        Edge Functions (API Routes)
                                  ↓
                    D1 Database (SQL) + KV + R2
```

### 构建流程
```bash
npm run build
  → next build (生成 .next/)
  → npx @cloudflare/next-on-pages
      → OpenNext 适配器
      → 生成 .vercel/output/
          ├── static/      (静态资源)
          ├── functions/   (Serverless Functions)
          └── config.js    (配置)
```

### wrangler.toml 配置
```toml
name = "us-chinese-community"
main = ".vercel/output/functions/_worker.js"
compatibility_date = "2024-12-01"
compatibility_flags = ["nodejs_compat"]

[d1_databases]
DB = { database_name = "ushrh", database_id = "..." }

[kv_namespaces]
KV = { id = "..." }

[r2_buckets]
R2 = { bucket_name = "ushrh" }

[vars]
JWT_SECRET = "..."
TURNSTILE_SITE_KEY = ""
TURNSTILE_SECRET_KEY = ""
```

---

## 📋 部署清单

### 准备工作
- [x] GitHub 仓库: https://github.com/Windy3399/us-chinese-community
- [x] Cloudflare 账号
- [x] D1 数据库创建
- [x] KV Namespace 创建
- [x] R2 Bucket 创建
- [ ] 配置环境变量
- [ ] 绑定 Cloudflare 资源
- [ ] 部署 Cloudflare Pages

### Cloudflare 配置步骤

#### 1. 创建 Pages 项目
1. 登录 Cloudflare Dashboard
2. 进入 **Pages** → **Create a project**
3. 连接 GitHub 仓库 `Windy3399/us-chinese-community`
4. 构建设置：
   - **Build command**: `npm run build && npx @cloudflare/next-on-pages`
   - **Build output directory**: `.vercel/output/static`
   - **Root directory**: (留空)
5. 创建环境变量：
   ```
   JWT_SECRET = K7mN9pQrStUvWxYzA1b2c3D4e5F6g7H8i9J0kL1mN2oP3qR4sT5uV6wX7yZ8
   TURNSTILE_SITE_KEY = (你的 Cloudflare Turnstile Site Key)
   TURNSTILE_SECRET_KEY = (你的 Cloudflare Turnstile Secret Key)
   NEXT_PUBLIC_APP_URL = https://your-site.pages.dev
   ```
6. 点击 **Save and Deploy**

#### 2. 配置资源绑定
部署完成后，进入项目 **Settings**：

**Functions → D1/KV/R2 bindings**:
```
DB = ushrh (D1)
KV = ushrh (KV)
R2 = ushrh (R2)
```

#### 3. 配置 Turnstile
1. 访问 https://dash.cloudflare.com/
2. 选择 **Turnstile**
3. 创建 Site Key + Secret Key
4. 填入 Pages 环境变量

#### 4. 初始化数据库
在 Cloudflare Dashboard → D1 → `ushrh` 数据库：

执行 **"Recover from backup"** 或手动执行 `db/schema.sql` 和 `db/seed.sql`

```bash
# 使用 wrangler 初始化（推荐）
npx wrangler d1 execute ushrh --file db/schema.sql --remote
npx wrangler d1 execute ushrh --file db/seed.sql --remote
```

---

## 🧪 本地开发

### 环境要求
- Node.js 20+
- pnpm / npm / yarn

### 快速开始
```bash
# 安装依赖
npm install

# 配置环境变量
cp .dev.vars .env.local

# 启动开发服务器
npm run dev
# 访问 http://localhost:3000
```

### 开发模式特性
- 使用模拟数据（无需数据库）
- API 自动降级到 Mock 数据
- 热重载（Fast Refresh）

### 生产模式测试
```bash
# 本地构建
npm run build

# 启动本地预览
npm run start

# 或使用 wrangler 本地模拟 Cloudflare 环境
npx wrangler pages dev .vercel/output/static
```

---

## 🔧 核心代码说明

### 认证流程 (`lib/auth.ts`)
```typescript
1. 用户登录 → 验证密码 (PBKDF2)
2. 生成 JWT Token (有效期 7 天)
3. 设置 HTTP-only Cookie
4. 后续请求自动验证 Token
5. 登出时清除 Cookie
```

### 数据库访问 (`lib/db.ts`)
```typescript
// 在 Cloudflare Workers 中，通过 request.env 访问
export function getDB(context: CloudflareContext): D1Database {
  return context.env.DB;
}
```

### 发帖限制逻辑
```sql
-- 检查用户今日发帖数
SELECT daily_post_count, last_post_date FROM users WHERE id = ?

-- 规则
IF last_post_date != today THEN count = 0
IF count >= 15 AND role != 'admin' THEN 拒绝发布
```

### 图片上传流程
```
前端 → /api/upload (Base64 转 Blob)
     → R2 Bucket (存储)
     → 返回 image_url
     → 发帖时保存到 post_images 表
```

---

## 📈 性能优化

### 已实现
- ✅ 图片懒加载（Next.js Image）
- ✅ 组件懒加载（动态导入）
- ✅ 静态资源 CDN（Cloudflare）
- ✅ 数据库索引（7 个关键索引）
- ✅ API 响应缓存（KV）
- ✅ 图片压缩（browser-image-compression）
- ✅ 包优化（optimizePackageImports）

### 待优化
- ⚠️ 帖子详情页浏览量缓存
- ⚠️ 热门帖子榜单（Redis 缓存）
- ⚠️ 搜索索引（Full-text search）
- ⚠️ 图片缩略图生成

---

## 🐛 已知问题

1. **开发模式模拟数据** - API 返回硬编码 mock 数据
2. **图片上传未完全实现** - R2 上传需要完善
3. **搜索功能简单** - 需添加全文索引
4. **评论功能前端未完成** - 页面组件待开发
5. **管理后台权限验证** - 需完善路由守卫

---

## 📅 后续规划

### Phase 1 - 核心功能 (✅ 已完成)
- [x] 用户认证
- [x] 帖子 CRUD
- [x] 分类系统
- [x] 评论系统
- [x] 后台管理

### Phase 2 - 体验优化 (🔄 进行中)
- [ ] 图片上传与压缩
- [ ] 实时消息通知
- [ ] 用户私信系统
- [ ] 帖子收藏功能
- [ ] 用户关注功能

### Phase 3 - 扩展功能 (📋 待开发)
- [ ] 即时通讯（WebSocket）
- [ ] 活动报名系统
- [ ] 在线支付集成
- [ ] 移动端 App (React Native)
- [ ] AI 智能推荐

---

## 📞 联系方式

- **GitHub**: https://github.com/Windy3399/us-chinese-community
- **Issues**: 提交 Bug 或功能请求
- **文档更新**: 2026-04-16

---

## 📄 许可证

本项目采用 MIT License。

---

**文档生成时间**: 2026-04-16  
**生成工具**: Cursor AI Assistant  
**文档版本**: v1.0
