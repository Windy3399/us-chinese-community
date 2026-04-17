import { Sparkles, Users, Shield, Globe } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">美国华人同城</h1>
              <p className="text-blue-200 text-sm">北美华人生活服务平台</p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 text-blue-200" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">覆盖北美50+城市</h3>
                <p className="text-blue-100/80 text-sm">专注服务北美各大城市的华人社区</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-blue-200" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">10万+活跃用户</h3>
                <p className="text-blue-100/80 text-sm">连接北美华人，共享本地生活经验</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-200" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">安全的交易保障</h3>
                <p className="text-blue-100/80 text-sm">严格的审核机制，保障您的交易安全</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">50+</div>
              <div className="text-blue-200 text-sm">覆盖城市</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">10万+</div>
              <div className="text-blue-200 text-sm">活跃用户</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">100万+</div>
              <div className="text-blue-200 text-sm">帖子总数</div>
            </div>
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full border border-white/10" />
        <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full border border-white/10" />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-zinc-50 dark:bg-zinc-950">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
