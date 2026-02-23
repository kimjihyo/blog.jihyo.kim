import createNextBundleAnalyzer from "@next/bundle-analyzer";
import createMDX from "@next/mdx";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const flexokiDark = require("./src/styles/flexoki-dark-color-theme.json");
const flexokiLight = require("./src/styles/flexoki-light-color-theme.json");

const withBundleAnalyzer = createNextBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  poweredByHeader: false,
  cacheComponents: true,
  serverExternalPackages: ["drizzle-orm"],
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [["remark-frontmatter"], ["remark-mdx-frontmatter"]],
    rehypePlugins: [
      ["rehype-slug"],
      ["@stefanprobst/rehype-extract-toc"],
      ["@stefanprobst/rehype-extract-toc/mdx"],
      [
        "rehype-pretty-code",
        {
          theme: {
            dark: flexokiDark,
            light: flexokiLight,
          },
          keepBackground: false,
          bypassInlineCode: false,
        },
      ],
    ],
  },
});

export default withBundleAnalyzer(withMDX(nextConfig));
