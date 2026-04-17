import Link from "next/link";
import { Sparkles, Mail, Phone, MapPin, Heart } from "lucide-react";

const footerLinks = {
  about: [
    { label: "关于我们", href: "/about" },
    { label: "使用条款", href: "/terms" },
    { label: "隐私政策", href: "/privacy" },
    { label: "联系我们", href: "/contact" },
  ],
  quick: [
    { label: "发布帖子", href: "/posts/new" },
    { label: "商家入驻", href: "/business" },
    { label: "帮助中心", href: "/help" },
    { label: "常见问题", href: "/faq" },
  ],
};

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-zinc-900 to-zinc-950 text-zinc-300">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all duration-300">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                美国华人同城
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              专注服务北美华人的生活社区平台，汇聚本地资讯、房屋租售、招聘求职、同城交易等实用信息。
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-zinc-400">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>contact@uschinese.com</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-zinc-400">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>1-800-US-CHINESE</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-zinc-400">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>美国 · 加拿大</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              关于我们
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-blue-400 transition-colors duration-300 inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              快速链接
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.quick.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-blue-400 transition-colors duration-300 inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              关注我们
            </h3>
            <p className="text-sm text-zinc-400 mb-4">
              扫描二维码关注微信公众号，获取最新资讯和活动信息。
            </p>
            <div className="flex gap-3">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 flex items-center justify-center">
                <span className="text-xs text-zinc-500">QR</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-20 h-8 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                  <span className="text-[10px] text-white font-medium">微信</span>
                </div>
                <div className="w-20 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-[10px] text-white font-medium">小红书</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-800/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-500 text-center md:text-left">
              © 2025 美国华人同城 · 所有内容保留1年，过期自动删除
            </p>
            <p className="text-sm text-zinc-500 flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for
              the Chinese Community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
