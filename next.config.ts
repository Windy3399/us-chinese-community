import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.workers.dev",
      },
      {
        protocol: "https",
        hostname: "**.cloudflare.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "sonner"],
  },
  serverExternalPackages: ["@node-rs/argon2"],
};

export default nextConfig;
