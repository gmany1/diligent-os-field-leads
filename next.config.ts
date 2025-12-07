import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',

  // Turbopack configuration (Next.js 16 default)
  turbopack: {
    // Resolve aliases if needed
    resolveAlias: {},
    // Rules for handling specific file types
    rules: {},
  },

  // Suppress middleware deprecation warning - will migrate to proxy later
  experimental: {
    // Temporarily suppress the middleware deprecation warning
    // TODO: Migrate to proxy pattern in future Next.js version
  },
};

export default nextConfig;
