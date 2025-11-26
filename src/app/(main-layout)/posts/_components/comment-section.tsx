import { CommentForm } from "./comment-form";
import { Comments } from "./comments";
import { db } from "@/db";
import { commentsTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { connection } from "next/server";

interface CommentSectionProps {
  postSlug: string;
}

export async function CommentSection({ postSlug }: CommentSectionProps) {
  await connection();
  const comments = await db
    .select()
    .from(commentsTable)
    .where(eq(commentsTable.postSlug, postSlug))
    .orderBy(desc(commentsTable.createdAt));

  return (
    <div className="animate-fadeIn">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="font-medium">댓글 {0}</div>
        <div className="text-sm text-muted-foreground">
          댓글 관련 문의: kimjihyo0325@gmail.com
        </div>
      </div>
      <CommentForm postSlug={postSlug} />
      <Comments comments={comments} />
    </div>
  );
}
