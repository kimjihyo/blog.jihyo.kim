import { MetadataRoute } from "next";
import { getBlogPosts, getAllTags } from "./(main-layout)/posts/utils";

const PAGE_SIZE = 8;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://blog.jihyo.kim";
  const allPosts = getBlogPosts();
  const allTags = getAllTags();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // /tags/all/[page]
  const allTotalPages = Math.ceil(allPosts.length / PAGE_SIZE);
  const allPaginationRoutes: MetadataRoute.Sitemap = Array.from(
    { length: allTotalPages },
    (_, i) => ({
      url: `${baseUrl}/tags/all/${i + 1}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.6,
    }),
  );

  // /tags/[tag]/[page]
  const tagPaginationRoutes: MetadataRoute.Sitemap = allTags.flatMap((tag) => {
    const totalPages = Math.ceil(tag.count / PAGE_SIZE);
    return Array.from({ length: totalPages }, (_, i) => ({
      url: `${baseUrl}/tags/${encodeURIComponent(tag.name)}/${i + 1}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));
  });

  const postRoutes: MetadataRoute.Sitemap = allPosts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`.replace(/\/$/, ""),
    changeFrequency: "daily" as const,
    priority: 0.7,
    lastModified: post.frontmatter.updatedTime || new Date(),
  }));

  return [
    ...staticRoutes,
    ...allPaginationRoutes,
    ...tagPaginationRoutes,
    ...postRoutes,
  ];
}
