import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,

  eslint: {
    ignoreDuringBuilds: false,
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      'recharts',
      'framer-motion',
    ],
    serverComponentsHmrCache: true,
  },

  turbopack: {
    root: process.cwd(),
  },

  logging: {
    fetches: {
      fullUrl: false,
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },

  poweredByHeader: false,
  compress: true,
};

export default nextConfig;