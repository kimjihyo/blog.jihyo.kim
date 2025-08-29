import { db } from "@/db";
import { commentsTable } from "@/db/schema";
import { desc } from "drizzle-orm";
import { LatestCommentCard } from "./latest-comment-card";
import { getBlogPosts } from "@/app/(main-layout)/posts/utils";

function getPostTitleFromSlug(slug: string) {
  const allPosts = getBlogPosts();
  const post = allPosts.find((post) => post.slug === slug);
  return post?.frontmatter.title ?? "";
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
