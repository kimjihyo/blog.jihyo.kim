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

export function PostCard({ index, post }: PostCardProps) {
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
          <div className="group h-[65px] w-[90px] overflow-hidden rounded bg-card sm:h-[90px] sm:w-[130px]">
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
