import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 2. Ignore TypeScript errors (like type mismatches)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;