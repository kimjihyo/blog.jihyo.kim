import type { NextConfig } from "next";
import { withContentCollections } from "@content-collections/next";
import createNextBundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = createNextBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    ppr: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

// withContentCollections must be the outermost plugin
export default withContentCollections(withBundleAnalyzer(nextConfig));
