import { getBlogPosts } from "../(main-layout)/posts/utils";
import { siteConfig } from "@/config/site";

export function GET() {
  const posts = getBlogPosts();

  const itemsXml = posts
    .map(
      (post) => `    <item>
      <title><![CDATA[${post.frontmatter.title}]]></title>
      <link>${siteConfig.url}/posts/${post.slug}</link>
      <guid isPermaLink="true">${siteConfig.url}/posts/${post.slug}</guid>
      <description><![CDATA[${post.frontmatter.summary}]]></description>
      <pubDate>${new Date(post.frontmatter.createdTime).toUTCString()}</pubDate>
${post.frontmatter.tags.map((tag) => `      <category>${tag}</category>`).join("\n")}
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name}</title>
    <link>${siteConfig.url}</link>
    <description>${siteConfig.description}</description>
    <language>ko</language>
    <lastBuildDate>${new Date(posts[0].frontmatter.createdTime).toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
