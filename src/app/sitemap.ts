import type { MetadataRoute } from "next";
import { getBlogPosts, getAllTags } from "./(main-layout)/posts/utils";
import { siteConfig } from "@/config/site";

const PAGE_SIZE = 8;

export default function sitemap(): MetadataRoute.Sitemap {
  const allPosts = getBlogPosts();
  const allTags = getAllTags();

  // 가장 최근 포스트의 수정일을 정적 라우트의 lastModified로 사용
  const latestPostDate = allPosts[0]?.frontmatter.updatedTime
    ? new Date(allPosts[0].frontmatter.updatedTime)
    : new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: latestPostDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/tags`,
      lastModified: latestPostDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}/search`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // /tags/all/[page]
  const allTotalPages = Math.ceil(allPosts.length / PAGE_SIZE);
  const allPaginationRoutes: MetadataRoute.Sitemap = Array.from(
    { length: allTotalPages },
    (_, i) => ({
      url: `${siteConfig.url}/tags/all/${i + 1}`,
      lastModified: latestPostDate,
      changeFrequency: "daily" as const,
      priority: 0.6,
    }),
  );

  // /tags/[tag]/[page]
  const tagPaginationRoutes: MetadataRoute.Sitemap = allTags.flatMap((tag) => {
    const totalPages = Math.ceil(tag.count / PAGE_SIZE);
    return Array.from({ length: totalPages }, (_, i) => ({
      url: `${siteConfig.url}/tags/${encodeURIComponent(tag.name)}/${i + 1}`,
      lastModified: latestPostDate,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));
  });

  const postRoutes: MetadataRoute.Sitemap = allPosts.map((post) => ({
    url: `${siteConfig.url}/posts/${post.slug}`,
    changeFrequency: "daily" as const,
    priority: 0.7,
    lastModified: post.frontmatter.updatedTime
      ? new Date(post.frontmatter.updatedTime)
      : undefined,
  }));

  return [
    ...staticRoutes,
    ...allPaginationRoutes,
    ...tagPaginationRoutes,
    ...postRoutes,
  ];
}
