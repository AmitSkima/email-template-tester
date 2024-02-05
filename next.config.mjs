import BundleAnalyser from "@next/bundle-analyzer";

const withBundleAnalyser = BundleAnalyser({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyser({
  reactStrictMode: true,
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
});

export default nextConfig;
