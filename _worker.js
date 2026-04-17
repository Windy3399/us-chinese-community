export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 日志：记录请求
    console.log('Request:', url.pathname);

    // 对于静态资产请求，从 KV 获取
    if (
      url.pathname.startsWith('/_next/') ||
      url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)
    ) {
      try {
        const asset = await getAssetFromKV({ request, env, ctx }, env);
        if (asset) {
          console.log('Serving static asset:', url.pathname);
          return asset;
        }
      } catch (e) {
        console.log('Static asset error:', e);
      }
    }

    // 所有其他请求转发到 Next.js 服务器
    console.log('Proxying to Next.js:', url.pathname);
    return fetch(request);
  },
};
