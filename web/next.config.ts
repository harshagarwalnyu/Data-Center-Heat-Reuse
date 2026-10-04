import type { NextConfig } from "next";

// Static export: the app runs from any file server, and offline on stage.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
