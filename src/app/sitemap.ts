import { allPosts } from "content-collections";
import { MetadataRoute } from "next";

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

  const postRoutes = allPosts.map((post) => ({
    url: `${baseUrl}/${post._meta.path}`.replace(/\/$/, ""),
    changeFrequency: "daily",
    priority: 0.7,
    lastModified: post.updatedTime || new Date(),
  })) as MetadataRoute.Sitemap;

  return [...staticRoutes, ...postRoutes];
}
