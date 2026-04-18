import { getAssetFromKV } from '@cloudflare/nextjs-on-pages'

export default {
  async fetch(request, env, ctx) {
    // 尝试从 KV 获取静态资源（如已预渲染的页面）
    const response = await getAssetFromKV(request)

    if (response) {
      return response
    }

    // 否则代理到 Next.js 应用处理
    return env.ASSETS.fetch(request)
  },
}
