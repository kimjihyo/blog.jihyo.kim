import { eq, desc } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "@/db";
import { commentsTable } from "@/db/schema";
import { CommentListItem } from "./comment-list-item";

interface CommentsProps {
  slug: string;
}

export async function CommentList({ slug }: CommentsProps) {
  await connection();
  const comments = await db
    .select()
    .from(commentsTable)
    .where(eq(commentsTable.postSlug, slug))
    .orderBy(desc(commentsTable.createdAt));

  return (
    <ul className="flex flex-col gap-4">
      {comments.map((comment) => (
        <CommentListItem key={comment.id} comment={comment} />
      ))}
    </ul>
  );
}

export function CommentListSkeleton() {
  return (
    <ul className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} className="bg-card text-card-foreground rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-foreground/5 h-10 w-10 animate-pulse rounded-full" />
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="bg-foreground/5 h-4 w-20 animate-pulse rounded" />
              <div className="bg-foreground/5 h-4 w-full animate-pulse rounded" />
              <div className="bg-foreground/5 h-4 w-3/4 animate-pulse rounded" />
              <div className="bg-foreground/5 h-3 w-32 animate-pulse rounded" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
