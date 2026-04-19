# 🚀 Cloudflare Pages 部署指南（一步到位）

## ✅ 前提条件
- [x] GitHub 仓库已创建：https://github.com/Windy3399/us-chinese-community
- [x] 代码已推送
- [x] Cloudflare 账号已注册

---

## 📋 部署步骤（5分钟搞定）

### 第 1 步：登录 Cloudflare Dashboard
访问 https://dash.cloudflare.com

---

### 第 2 步：创建 Pages 项目

1. 点击左侧菜单 **Pages** → **Create a project**

2. **连接 GitHub 仓库**
   - 点击 **Connect to Git**
   - 选择 **GitHub** 作为托管提供商
   - 授权 Cloudflare 访问你的 GitHub 账号
   - 找到仓库 `Windy3399/us-chinese-community`
   - 点击 **Begin setup**

3. **配置构建设置**

   | 字段 | 值 |
   |------|-----|
   | **Production branch** | `main` |
   | **Build command** | `npm run build && npx @cloudflare/next-on-pages` |
   | **Build output directory** | `.vercel/output/static` |
   | **Root directory** | *(留空)* |
   | **Environment variables** | 见下方 |

4. **添加环境变量**（点击 **Add variable**）

   | Key | Value | 说明 |
   |-----|-------|------|
   | `JWT_SECRET` | `K7mN9pQrStUvWxYzA1b2c3D4e5F6g7H8i9J0kL1mN2oP3qR4sT5uV6wX7yZ8` | JWT 签名密钥（至少32字符） |
   | `TURNSTILE_SITE_KEY` | *(待填)* | Cloudflare Turnstile Site Key |
   | `TURNSTILE_SECRET_KEY` | *(待填)* | Cloudflare Turnstile Secret Key |
   | `NEXT_PUBLIC_APP_URL` | `https://your-site.pages.dev` | 你的站点URL（部署后修改） |

   > **注意**：Turnstile 键需要在 Cloudflare Dashboard 中创建（见第 3 步）

5. 点击 **Save and Deploy**

---

### 第 3 步：配置 Cloudflare Turnstile（人机验证）

部署需要 Turnstile 密钥，按以下步骤获取：

1. 访问 https://dash.cloudflare.com/
2. 在左侧菜单找到 **Turnstile**（在 "Security" 下）
3. 点击 **Add Site**
4. 填写表单：
   - **Site name**: `US Chinese Community`
   - **Domain**: `your-site.pages.dev`（你的域名）
   - **Widget Mode**: `Managed`
5. 点击 **Create**
6. 复制 **Site Key** 和 **Secret Key**
7. 回到 Cloudflare Pages 项目：
   - **Settings** → **Environment Variables**
   - 编辑 `TURNSTILE_SITE_KEY` 和 `TURNSTILE_SECRET_KEY`
   - 点击 **Save**
8. **重新部署**（Deployments → **Retry deploy**）

---

### 第 4 步：配置 D1/KV/R2 绑定

部署完成后（或部署前），需要绑定 Cloudflare 资源：

1. 进入项目 **Settings** → **Functions** → **D1/KV/R2 bindings**

2. 添加以下绑定：

   | Binding | Resource | 类型 |
   |---------|----------|------|
   | `DB` | `ushrh` | D1 Database |
   | `KV` | `ushrh` | KV Namespace |
   | `R2` | `ushrh` | R2 Bucket |

   > 如果资源不存在，需要先在 Cloudflare Dashboard 创建：
   > - **D1**: https://dash.cloudflare.com/?to=/:account/workers/d1
   > - **KV**: https://dash.cloudflare.com/?to=/:account/workers/kv
   > - **R2**: https://dash.cloudflare.com/?to=/:account/workers/r2

3. 保存后重新部署

---

### 第 5 步：初始化数据库

如果 D1 数据库是新建的，需要执行建表语句：

#### 方法 A：使用 Wrangler CLI（推荐）

1. 安装 Wrangler：
```bash
npm install -g wrangler
```

2. 登录 Cloudflare：
```bash
wrangler login
```

3. 执行建表脚本：
```bash
wrangler d1 execute ushrh --file db/schema.sql --remote
wrangler d1 execute ushrh --file db/seed.sql --remote
```

#### 方法 B：在 Cloudflare Dashboard 手动执行

1. 进入 Cloudflare Dashboard → **Workers & Pages** → **D1**
2. 选择数据库 `ushrh`
3. 点击 **Query** 标签
4. 复制 `db/schema.sql` 内容，粘贴并执行
5. 再复制 `db/seed.sql` 内容，执行

---

### 第 6 步：查看部署结果

1. 部署成功后，进入 **Deployments** 标签
2. 点击最新部署的 **Preview** 按钮
3. 查看你的网站！

首次部署可能需要 2-5 分钟（包括安装依赖、构建、适配器转换）。

---

## 🔧 常见问题

### Q1: 构建失败，提示 "Cannot find module '@cloudflare/next-on-pages'"
**解决**：Cloudflare 构建环境会自动安装 `package.json` 中的依赖，确保 `@cloudflare/next-on-pages` 在 `devDependencies` 中（已配置 ✅）

### Q2: 环境变量不生效
**解决**：
- 确保变量名拼写正确
- 修改环境变量后必须**重新部署**
- 在代码中使用 `process.env.VAR_NAME` 访问

### Q3: 数据库连接失败
**解决**：
- 检查 D1 绑定是否配置（`DB = ushrh`）
- 检查数据库是否已初始化（执行了 schema.sql）
- 查看 Functions 日志（**Settings** → **Functions** → **Logs**）

### Q4: 图片无法显示
**解决**：
- R2 Bucket 是否创建并绑定
- 图片 URL 是否为 `https://pub-xxx.r2.dev/...`
- `next.config.ts` 中 `images.remotePatterns` 是否包含 R2 域名

### Q5: 页面空白或 404
**解决**：
- 检查构建输出目录是否正确：`.vercel/output/static`
- 检查是否有 `_worker.js` 文件生成
- 查看部署日志，确认所有文件已上传

---

## 📊 部署检查清单

- [ ] GitHub 仓库代码最新（`git push`）
- [ ] Cloudflare Pages 项目已创建
- [ ] 构建设置正确（build command + output directory）
- [ ] 环境变量已添加（JWT_SECRET, TURNSTILE_*）
- [ ] D1 数据库已创建并绑定
- [ ] KV Namespace 已创建并绑定
- [ ] R2 Bucket 已创建并绑定
- [ ] 数据库已初始化（执行 schema.sql + seed.sql）
- [ ] Turnstile Site Key 已创建并配置
- [ ] 首次部署完成
- [ ] 网站可访问
- [ ] API 路由测试通过

---

## 🎯 下一步优化

部署成功后，可以：
1. 配置自定义域名（**Settings** → **Custom domains**）
2. 开启 HTTPS（自动提供）
3. 配置缓存策略（**Settings** → **Caching**）
4. 添加监控（**Analytics**）
5. 设置 CI/CD（自动部署）

---

## 📞 需要帮助？

如果部署遇到问题：
1. 查看 **Deployments** 日志（点击失败任务 → **View full logs**）
2. 查看 **Functions** 日志（**Settings** → **Functions** → **Logs**）
3. 在 GitHub 提交 Issue：https://github.com/Windy3399/us-chinese-community/issues

---

**准备好了吗？开始部署吧！** 🚀

部署完成后，把你的站点 URL 告诉我，我来帮你测试！
