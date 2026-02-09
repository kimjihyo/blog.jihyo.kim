import { getAllTags, getBlogPosts } from "@/app/(main-layout)/posts/utils";
import { Shell } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "태그",
  description: "모든 태그 목록",
};

export default function TagsPage() {
  const tags = getAllTags();
  const allPosts = getBlogPosts();

  return (
    <Shell className="flex flex-col">
      <div className="flex justify-evenly">
        <div className="flex max-w-2xl flex-1 flex-col lg:pr-6 lg:pt-2">
          <div className="mb-8">
            <h1 className="mb-2 text-2xl font-bold">태그</h1>
            <p className="text-muted-foreground text-sm">
              {tags.length}개의 태그, {allPosts.length}개의 글
            </p>
          </div>
          <ul className="flex flex-col gap-4">
            {tags.map((tag) => {
              const postsForTag = allPosts
                .filter((p) => p.frontmatter.tags?.includes(tag.name))
                .slice(0, 3);

              return (
                <li key={tag.name}>
                  <Link
                    href={`/tags/${tag.name}/1`}
                    className="bg-card hover:bg-card-accent group block rounded-lg p-4 transition-colors"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <Badge variant="primary" className="px-2.5 py-0.5">
                        {tag.name}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        {tag.count}개의 글
                      </span>
                    </div>
                    <ul className="flex flex-col gap-1">
                      {postsForTag.map((post) => (
                        <li
                          key={post.slug}
                          className="text-muted-foreground group-hover:text-foreground flex items-center gap-2 text-sm transition-colors"
                        >
                          <span className="text-muted-foreground/50 shrink-0">
                            ·
                          </span>
                          <span className="truncate">
                            {post.frontmatter.title}
                          </span>
                        </li>
                      ))}
                      {tag.count > 3 && (
                        <li className="text-muted-foreground/60 pl-4 text-xs">
                          외 {tag.count - 3}개
                        </li>
                      )}
                    </ul>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Shell>
  );
}
