# 部署说明

## 环境要求

- Node.js 18+
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare 账号

## 必要环境变量

在 `wrangler.toml` 或 Cloudflare Pages 环境变量中配置：

```toml
# wrangler.toml
[vars]
JWT_SECRET = "your-secret-key-change-in-production"
R2_PUBLIC_URL = "https://your-account.r2.dev"
```

## R2 存储配置

### 1. 创建 R2 Bucket

```bash
wrangler r2 bucket create us-chinese-community-images
```

### 2. 绑定 R2 Bucket 到 Pages 项目

在 Cloudflare Dashboard 中：
1. 进入 Pages 项目 → Settings → Functions
2. 在 R2 bucket bindings 中添加：
   - 变量名: `R2`
   - 绑定名称: `us-chinese-community-images`

### 3. 配置公开访问

#### 方式一：使用 R2.dev 公开域名（推荐开发/测试）

Cloudflare R2 支持通过 `{account_id}.r2.dev` 公开访问。

```bash
# 创建一个公开的 R2 bucket
wrangler r2 bucket create us-chinese-community-images --public
```

或在 Cloudflare Dashboard：
1. 进入 R2 → 你的 Bucket → Settings
2. 启用 "Allow public access"

公开 URL 格式：`https://{account_id}.r2.dev/{object_key}`

#### 方式二：自定义域名（推荐生产环境）

1. 在 Cloudflare Dashboard 进入 R2 → 你的 Bucket → Settings
2. 添加 Custom Domain
3. 添加 DNS 记录指向 R2
4. 配置 `R2_PUBLIC_URL` 为你的自定义域名

示例：
```toml
[vars]
R2_PUBLIC_URL = "https://cdn.example.com"
```

### 4. 设置环境变量

```bash
# 部署时
npx wrangler pages deploy .next --env production

# 设置环境变量
wrangler secret put JWT_SECRET
wrangler secret put R2_PUBLIC_URL
```

## 图片上传说明

### 前端压缩

所有上传的图片都会在前端使用 `browser-image-compression` 库自动压缩：
- 最大文件大小：200KB
- 最大尺寸：1920px
- 输出格式：WebP

### 上传路径格式

```
images/{userId}/{timestamp}-{uuid}.webp
```

示例：`images/user123abc/1713001234567-a1b2c3d4.webp`

### 限制

- 支持格式：JPEG、PNG、WebP
- 最大原文件大小：5MB
- 最大上传数量：每帖 5 张

## 数据库迁移

### 初始化数据库

```bash
wrangler d1 execute usrhc --file=./schema.sql --local
# 或生产环境
wrangler d1 execute usrhc --file=./schema.sql --remote --env production
```

## 常用命令

```bash
# 本地开发
npm run dev

# 构建
npm run build

# Cloudflare Pages 部署
npm run dev:cf

# 查看日志
wrangler pages project list
wrangler pages deployment list
```

## 故障排除

### 图片无法访问

1. 确认 R2 bucket 已配置公开访问
2. 检查 `R2_PUBLIC_URL` 环境变量配置
3. 确认 R2 bucket 已正确绑定到 Functions

### 上传失败

1. 检查用户是否已登录
2. 确认文件类型和大小符合要求
3. 查看 Cloudflare Pages Functions 日志
