import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "pg"],
  transpilePackages: ["@react-pdf/renderer"],
};

export default nextConfig;
