import type { Post } from "content-collections";
import Link from "next/link";
import { Image } from "@/components/ui/image";
import { Badge } from "@/components/ui/badge";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const thumbnailUrl =
    post.thumbnail ?? `/api/post-thumbnail/${post._meta.path}`;

  return (
    <article>
      <Link href={`/posts/${post._meta.path}`} className="group h-full">
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
          <div>
            <div className="w-[90px] h-[65px] sm:w-[130px] sm:h-[90px] overflow-hidden relative rounded bg-card">
              <Image
                fill
                sizes="(min-width) 180px, 260px"
                alt=""
                className="absolute inset-0 w-full h-full object-center object-cover rounded group-hover:scale-120 transition-transform duration-300"
                src={thumbnailUrl}
              />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
