import { getAssetFromKV } from '@cloudflare/nextjs-on-pages'

export default {
  async fetch(request, env, ctx) {
    try {
      const response = await getAssetFromKV(event)

      if (response) {
        return response
      }

      return env.ASSETS.fetch(request)
    } catch (e) {
      return env.ASSETS.fetch(request)
    }
  },
}
