import { db } from "@/db";
import { commentsTable } from "@/db/schema";
import { NextRequest } from "next/server";
import { eq, desc } from "drizzle-orm";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const comments = await db
    .select()
    .from(commentsTable)
    .where(eq(commentsTable.postSlug, slug))
    .orderBy(desc(commentsTable.createdAt));
  return Response.json(comments);
}
