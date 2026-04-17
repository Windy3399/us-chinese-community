import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 静态资产直接返回
    if (
      url.pathname.startsWith('/_next/') ||
      url.pathname.startsWith('/static/') ||
      url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp|avif)$/)
    ) {
      try {
        const asset = await getAssetFromKV({ request, env, ctx }, env);
        if (asset) {
          return asset;
        }
      } catch (e) {
        console.error('Asset error:', e);
      }
    }

    // 其他所有请求（包括 API、页面）代理到 Next.js
    return fetch(request);
  },
};
