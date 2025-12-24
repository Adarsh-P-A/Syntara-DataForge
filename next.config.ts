import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", 
  
  // 1. Ignore ESLint errors (like unused variables)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 2. Ignore TypeScript errors (like type mismatches)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;