import { db } from "@/db";
import { commentsTable } from "@/db/schema";
import { allPosts } from "content-collections";
import { desc } from "drizzle-orm";
import { LatestCommentCard } from "./latest-comment-card";

function getPostTitleFromSlug(slug: string) {
  const post = allPosts.find((post) => post._meta.path === slug);
  return post?.title ?? "";
}

export async function LatestComments() {
  const comments = await db
    .select()
    .from(commentsTable)
    .orderBy(desc(commentsTable.createdAt))
    .limit(5);

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment, index) => (
        <LatestCommentCard
          key={comment.id}
          avatarImgSrc={comment.avatar}
          nickname={comment.nickname}
          content={comment.content}
          postSlug={comment.postSlug}
          postTitle={getPostTitleFromSlug(comment.postSlug)}
          index={index}
        />
      ))}
    </div>
  );
}
