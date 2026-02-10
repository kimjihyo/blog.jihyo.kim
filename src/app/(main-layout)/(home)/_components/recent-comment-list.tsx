import { Suspense } from "react";
import { cacheLife } from "next/cache";
import { db } from "@/db";
import { commentsTable } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getBlogPosts } from "../../posts/utils";
import { RecentCommentListItem } from "./recent-comment-list-item";

async function RecentCommentListInner() {
  "use cache";
  cacheLife("minutes");

  const comments = await db
    .select()
    .from(commentsTable)
    .orderBy(desc(commentsTable.createdAt))
    .limit(8);

  const allPosts = getBlogPosts();

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => {
        const postTitle =
          allPosts.find((p) => p.slug === comment.postSlug)?.frontmatter
            .title ?? "";
        return (
          <RecentCommentListItem
            key={comment.id}
            avatarImgSrc={comment.avatar}
            nickname={comment.nickname}
            content={comment.content}
            postSlug={comment.postSlug}
            postTitle={postTitle}
          />
        );
      })}
    </div>
  );
}

export function RecentCommentList() {
  return (
    <Suspense fallback={<RecentCommentListSkeleton />}>
      <RecentCommentListInner />
    </Suspense>
  );
}

export function RecentCommentListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 rounded-lg bg-card p-4 py-2 text-card-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 animate-pulse rounded-full bg-foreground/5" />
            <div className="h-4 w-20 animate-pulse rounded bg-foreground/5" />
          </div>
          <div className="h-8 animate-pulse rounded bg-foreground/5" />
          <div className="h-3 w-32 animate-pulse rounded bg-foreground/5" />
        </div>
      ))}
    </div>
  );
}
