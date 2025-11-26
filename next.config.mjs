import createNextBundleAnalyzer from "@next/bundle-analyzer";
import createMDX from "@next/mdx";

const withBundleAnalyzer = createNextBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  /* metadata 가 스트림돼서 body 태그에 들어가는 기능이 있는데. 원치않음. 아래 방식으로 비활성화 할 수 있음 참고: https://github.com/vercel/next.js/issues/793131 */
  htmlLimitedBots: /.*/,
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

// export default withBundleAnalyzer(withMDX(nextConfig));
export default withMDX(nextConfig);
