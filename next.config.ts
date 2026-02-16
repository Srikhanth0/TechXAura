import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: [],
  },
  // 1. Disable Source Maps (Saves huge RAM/CPU)
  productionBrowserSourceMaps: false,

  // 3. Aggressive Caching for Builds
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
