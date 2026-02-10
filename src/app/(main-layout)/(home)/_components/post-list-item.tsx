import Link from "next/link";
import { Image } from "@/components/ui/image";
import { Badge } from "@/components/ui/badge";

interface PostCardProps {
  index: number;
  post: {
    frontmatter: Partial<{
      tags: string[];
      createdTime: string;
      thumbnail: string;
      summary: string;
      updatedTime: string;
      title: string;
    }>;
    slug: string;
  };
}

export function PostListItem({ index, post }: PostCardProps) {
  return (
    <article>
      <Link
        href={`/posts/${post.slug}`}
        className="group block py-6 duration-300 ease-in-out active:scale-97"
      >
        <div className="mb-1.5 flex items-center gap-1">
          {post.frontmatter.tags?.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <div className="flex gap-5">
          <div className="flex-1">
            <h2 className="mb-1.5 text-base font-semibold text-foreground transition-colors group-hover:text-primary xs:text-xl">
              {post.frontmatter.title}
            </h2>
            <p className="mb-4 text-sm text-muted-foreground sm:text-base">
              {post.frontmatter.summary}
            </p>
            <p className="text-xs text-muted-foreground sm:text-sm">
              {post.frontmatter.createdTime &&
                new Date(post.frontmatter.createdTime).toLocaleDateString(
                  "ko-KR",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "Asia/Seoul",
                  },
                )}
            </p>
          </div>
          <div className="group h-16.25 w-22.5 overflow-hidden rounded bg-card sm:h-22.5 sm:w-32.5">
            <div className="relative h-full w-full transition-transform duration-300 group-hover:scale-120">
              {post.frontmatter.thumbnail && (
                <Image
                  fetchPriority={index === 0 ? "high" : "auto"}
                  priority={index === 0}
                  fill
                  sizes="(max-width: 640px) 90px, 130px"
                  alt=""
                  className="h-full w-full object-cover object-center"
                  src={post.frontmatter.thumbnail}
                />
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function PostListItemSkeleton() {
  return (
    <article className="py-6">
      <div className="mb-1.5 flex items-center gap-1">
        <div className="h-5 w-12 animate-pulse rounded-full bg-muted" />
        <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="flex gap-5">
        <div className="flex-1">
          <div className="mb-1.5 h-6 w-3/4 animate-pulse rounded bg-muted xs:h-7" />
          <div className="mb-4 space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-muted sm:h-5" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted sm:h-5" />
          </div>
          <div className="h-3 w-32 animate-pulse rounded bg-muted sm:h-4" />
        </div>
        <div className="h-16.25 w-22.5 animate-pulse rounded bg-muted sm:h-22.5 sm:w-32.5" />
      </div>
    </article>
  );
}
