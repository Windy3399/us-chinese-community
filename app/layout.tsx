import type { Metadata } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import "./globals.css";

const notoSans = Noto_Sans_SC({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const notoSerif = Noto_Serif_SC({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "美国华人同城 - 北美华人社区生活服务平台",
    template: "%s | 美国华人同城"
  },
  description: "北美华人社区生活服务平台 - 本地资讯、房屋租售、招聘求职、同城交易",
  keywords: ["北美华人", "美国华人", "同城社区", "房屋租售", "招聘求职", "本地资讯", "华人论坛"],
  authors: [{ name: "US Chinese Community" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://uschinesecommunity.com",
    siteName: "美国华人同城",
    title: "美国华人同城 - 北美华人社区生活服务平台",
    description: "北美华人社区生活服务平台 - 本地资讯、房屋租售、招聘求职、同城交易",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "美国华人同城",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@uschinesecommunity",
    title: "美国华人同城 - 北美华人社区生活服务平台",
    description: "北美华人社区生活服务平台 - 本地资讯、房屋租售、招聘求职、同城交易",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body
        className={`${notoSans.variable} ${notoSerif.variable} h-full antialiased`}
      >
        <AuthProvider>
          <AnnouncementBanner />
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <div className="max-w-7xl mx-auto px-4 py-6">
                {children}
              </div>
            </main>
            <Footer />
          </div>
        </AuthProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
