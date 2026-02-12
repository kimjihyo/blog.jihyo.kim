import createNextBundleAnalyzer from "@next/bundle-analyzer";
import createMDX from "@next/mdx";

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
  outputFileTracingIncludes: {
    "/opengraph-image": ["./src/assets/fonts/**/*"],
    "/posts/\\[slug\\]/opengraph-image*": ["./src/assets/fonts/**/*"],
    "/icon-192.png": ["./src/assets/fonts/**/*"],
    "/icon-512.png": ["./src/assets/fonts/**/*"],
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
            dark: "github-dark",
            light: "github-light",
          },
          keepBackground: false,
          bypassInlineCode: false,
        },
      ],
    ],
  },
});

export default withBundleAnalyzer(withMDX(nextConfig));
