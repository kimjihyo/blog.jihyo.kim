import type { Post } from "content-collections";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { formatDate } from "@/lib/utils";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article>
      <Link
        href={`/posts/${post._meta.path}`}
        className="group flex flex-col gap-1 h-full justify-between"
      >
        <h2 className="text-2xl font-semibold text-foreground/80 transition-colors group-hover:text-foreground">
          {post.title}
        </h2>
        <p className="text-muted-foreground">{post.summary}</p>
        <ul className="flex flex-wrap gap-1">
          {post.tags.map((tag) => (
            <li key={tag}>
              <Badge>{tag}</Badge>
            </li>
          ))}
        </ul>
        <time
          className="block line-clamp-1 text-sm text-muted-foreground"
          dateTime={post.date}
        >
          {formatDate(post.date)}
        </time>
      </Link>
    </article>
  );
}
