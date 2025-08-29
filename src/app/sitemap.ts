import { MetadataRoute } from "next";
import { getBlogPosts } from "./(main-layout)/posts/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://blog.jihyo.kim";

  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
  ] as MetadataRoute.Sitemap;

  const allPosts = getBlogPosts();
  const postRoutes = allPosts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`.replace(/\/$/, ""),
    changeFrequency: "daily",
    priority: 0.7,
    lastModified: post.frontmatter.updatedTime || new Date(),
  })) as MetadataRoute.Sitemap;

  return [...staticRoutes, ...postRoutes];
}
