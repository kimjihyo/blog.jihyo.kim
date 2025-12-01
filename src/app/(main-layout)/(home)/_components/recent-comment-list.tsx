import { db } from "@/db";
import { commentsTable } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getBlogPosts } from "@/app/(main-layout)/posts/utils";
import { RecentCommentListItem } from "./recent-comment-list-item";

function getPostTitleFromSlug(slug: string) {
  const allPosts = getBlogPosts();
  const post = allPosts.find((post) => post.slug === slug);
  return post?.frontmatter.title ?? "";
}

export async function RecentCommentList() {
  const comments = await db
    .select()
    .from(commentsTable)
    .orderBy(desc(commentsTable.createdAt))
    .limit(8);

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <RecentCommentListItem
          key={comment.id}
          avatarImgSrc={comment.avatar}
          nickname={comment.nickname}
          content={comment.content}
          postSlug={comment.postSlug}
          postTitle={getPostTitleFromSlug(comment.postSlug)}
        />
      ))}
    </div>
  );
}

export function RecentCommentListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-card text-card-foreground flex flex-col gap-2 rounded-lg p-4 py-2"
        >
          <div className="flex items-center gap-2">
            <div className="bg-foreground/5 h-6 w-6 animate-pulse rounded-full" />
            <div className="bg-foreground/5 h-4 w-20 animate-pulse rounded" />
          </div>
          <div className="bg-foreground/5 h-8 animate-pulse rounded" />
          <div className="bg-foreground/5 h-3 w-32 animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}
