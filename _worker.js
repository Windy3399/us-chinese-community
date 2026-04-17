import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;

      // 对于 API 请求，直接转发到 Next.js 服务器
      if (pathname.startsWith('/api/')) {
        const response = await fetch(request);
        return response;
      }

      // 对于静态资产和页面，从 KV 获取
      const asset = await getAssetFromKV(event, env);
      if (asset) {
        return asset;
      }

      // 如果没有找到静态资产，回退到 Next.js 服务器
      const response = await fetch(request);
      return response;
    } catch (e) {
      // 出错时回退到 Next.js 服务器
      const response = await fetch(request);
      return response;
    }
  },
};
