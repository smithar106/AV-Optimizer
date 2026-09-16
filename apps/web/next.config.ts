import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle for a small Docker image on Railway.
  output: "standalone",
};

export default nextConfig;
