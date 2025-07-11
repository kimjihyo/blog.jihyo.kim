import type { Post } from "content-collections";
import Link from "next/link";
import { Image } from "@/components/ui/image";
import { Badge } from "@/components/ui/badge";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article>
      <Link
        href={`/posts/${post._meta.path}`}
        className="block group py-6 active:scale-97 duration-300 ease-in-out"
      >
        <div className="flex items-center gap-1 mb-1.5">
          {post.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <div className="flex gap-5">
          <div className="flex-1">
            <h2 className="text-base xs:text-xl font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors">
              {post.title}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-4">
              {post.summary}
            </p>
            <p className="text-muted-foreground text-xs sm:text-sm">
              {post.createdTime.toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "Asia/Seoul",
              })}
            </p>
          </div>
          <div className="w-[90px] h-[65px] sm:w-[130px] sm:h-[90px] overflow-hidden rounded bg-card group">
            <div className="relative w-full h-full group-hover:scale-120 transition-transform duration-300">
              <Image
                fill
                sizes="(max-width: 640px) 90px, 130px"
                alt=""
                className="w-full h-full object-center object-cover"
                src={post.thumbnail}
              />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
