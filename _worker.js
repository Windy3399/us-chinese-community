export default {
  async fetch(request, env, ctx) {
    // 直接代理所有请求到 Next.js 应用
    // Cloudflare Pages 会自动处理静态资源
    return env.ASSETS.fetch(request)
  },
}
