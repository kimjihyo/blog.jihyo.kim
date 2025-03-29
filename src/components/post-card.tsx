import type { Post } from "content-collections";
import Link from "next/link";
import { Badge } from "./ui/badge";
import Image from "next/image";

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
  const createdAt = new Date(post.date);

  return (
    <article>
      <Link
        href={`/posts/${post._meta.path}`}
        className="group h-full flex gap-5"
      >
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mb-4">
            {post.summary}
          </p>
          <div className="flex items-center gap-1">
            {post.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </div>
        <div>
          <div className="w-20 h-20 sm:w-32 sm:h-32 mb-auto overflow-hidden relative">
            {post.thumbnail ? (
              <Image
                fill
                sizes="(min-width) 80px, 128px"
                alt=""
                className="object-center object-cover rounded"
                src={post.thumbnail!}
              />
            ) : (
              <div className="w-full h-full rounded bg-gray-200" />
            )}
            <div className="absolute left-0 top-0 z-10 bg-background flex flex-col items-center justify-center w-full h-full -translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <div className="text-2xl sm:text-4xl font-extrabold">
                {createdAt.getDate()}
              </div>
              <div className="text-sm sm:text-base">
                {months[createdAt.getMonth()]}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
