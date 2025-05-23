import type { Post } from "content-collections";
import Link from "next/link";
import { Image } from "./ui/image";
import { Badge } from "./ui/badge";

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
            <h2 className="text-base sm:text-xl font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors">
              {post.title}
            </h2>
            <p className="text-muted-foreground text-xs/5 sm:text-base">
              {post.summary}
            </p>
          </div>
          <div>
            <div className="w-[90px] h-[65px] sm:w-[130px] sm:h-[90px] overflow-hidden relative">
              {post.thumbnail && (
                <div className="w-full h-full bg-card rounded relative">
                  <Image
                    fill
                    sizes="(min-width) 180px, 260px"
                    alt=""
                    className="object-center object-cover rounded"
                    src={post.thumbnail!}
                  />
                </div>
              )}
              <div className="absolute left-0 top-0 z-10 bg-background flex flex-col items-center justify-center w-full h-full -translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div className="text-2xl sm:text-4xl font-extrabold">
                  {post.createdTime.getDate()}
                </div>
                <div className="text-sm sm:text-base">
                  {months[post.createdTime.getMonth()]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
