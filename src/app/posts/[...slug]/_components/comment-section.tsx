import { db } from "@/db";
import { CommentForm } from "./comment-form";
import { commentsTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Comments } from "./comments";
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
    <div>
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="font-medium">댓글 {comments.length}</div>
        <div className="text-sm text-muted-foreground">
          댓글 관련 문의: kimjihyo0325@gmail.com
        </div>
      </div>
      <CommentForm postSlug={postSlug} />
      <Comments comments={comments} />
    </div>
  );
}
