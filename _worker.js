export default {
  async fetch(request, env, ctx) {
    // 对于 API 请求，直接转发到 Next.js 服务器
    if (request.url.includes('/api/')) {
      return fetch(request);
    }

    // 对于所有其他请求，使用 Next.js 处理
    const url = new URL(request.url);

    // 添加必要的头部
    const modifiedRequest = new Request(request, {
      headers: request.headers,
    });

    return fetch(modifiedRequest);
  },
};
