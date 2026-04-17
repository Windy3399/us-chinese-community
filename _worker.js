export default {
  async fetch(request, env, ctx) {
    // 直接代理所有请求到 Next.js 服务器
    // Cloudflare Pages 会自动处理静态资产的缓存
    return fetch(request);
  },
};
