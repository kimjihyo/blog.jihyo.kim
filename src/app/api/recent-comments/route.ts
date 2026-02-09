import { NextResponse } from "next/server";
import { db } from "@/db";
import { commentsTable } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getBlogPosts } from "@/app/(main-layout)/posts/utils";

export async function GET() {
  const comments = await db
    .select()
    .from(commentsTable)
    .orderBy(desc(commentsTable.createdAt))
    .limit(8);

  const allPosts = getBlogPosts();
  const result = comments.map((comment) => ({
    id: comment.id,
    nickname: comment.nickname,
    content: comment.content,
    avatar: comment.avatar,
    postSlug: comment.postSlug,
    postTitle:
      allPosts.find((p) => p.slug === comment.postSlug)?.frontmatter.title ??
      "",
  }));

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
