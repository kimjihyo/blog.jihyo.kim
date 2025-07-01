import { allPosts } from "content-collections";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://blog.jihyo.kim";

  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date().toISOString(),
      priority: 1,
    },
  ];

  const postRoutes = allPosts.map((post) => ({
    url: `${baseUrl}/${post._meta.path}`.replace(/\/$/, ""),
    lastModified: post.updatedTime
      ? new Date(post.updatedTime).toISOString()
      : new Date().toISOString(),
  }));

  return [...staticRoutes, ...postRoutes];
}
