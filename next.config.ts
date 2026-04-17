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
      {
        protocol: "https",
        hostname: "pub-d7190d858f4f4f4c9d7d47c40a9e1f09.r2.dev",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "sonner"],
  },
  serverExternalPackages: ["@node-rs/argon2"],
};

export default nextConfig;
