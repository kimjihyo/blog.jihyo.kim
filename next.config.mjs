import createNextBundleAnalyzer from "@next/bundle-analyzer";
import createMDX from "@next/mdx";

const withBundleAnalyzer = createNextBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  /* config options here */
  experimental: {
    ppr: "incremental",
    optimizePackageImports: ["@radix-ui/react-icons", "lucide-react", "motion"]
  },
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
            dark: "one-dark-pro",
            light: "one-light",
          },
          keepBackground: false,
          bypassInlineCode: false,
        },
      ],
    ],
  },
});

export default withBundleAnalyzer(withMDX(nextConfig));
