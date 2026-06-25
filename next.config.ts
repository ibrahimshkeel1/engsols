import type { NextConfig } from "next";
import path from "node:path";

const projectRoot = path.resolve(__dirname);

let nextConfig: NextConfig = {
  // Keep Turbopack scoped to this app (Desktop has multiple lockfiles).
  turbopack: {
    root: projectRoot,
  },
  experimental: {
    // Prevent multi-GB `.next/dev/cache/turbopack` growth across sessions.
    turbopackFileSystemCacheForDev: false,
    // Stops runaway dev-server RAM/CPU from server-component fast refresh loops.
    turbopackServerFastRefresh: false,
    // Cap Turbopack dev worker heap (MB). Raise only if you hit legitimate OOM during compile.
    turbopackMemoryLimit: 2048,
    optimizePackageImports: [
      "lucide-react",
      "date-fns",
      "framer-motion",
      "@livekit/components-react",
    ],
  },
  serverExternalPackages: [
    "livekit-server-sdk",
    "isomorphic-dompurify",
    "stripe",
    "web-push",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

if (process.env.ANALYZE === "true") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: true,
  });
  nextConfig = withBundleAnalyzer(nextConfig);
}

export default nextConfig;
