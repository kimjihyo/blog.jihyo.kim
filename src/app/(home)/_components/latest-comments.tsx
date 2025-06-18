import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db } from "@/db";
import { commentsTable } from "@/db/schema";
import { allPosts } from "content-collections";
import { desc } from "drizzle-orm";
import Link from "next/link";

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
      {comments.map((comment) => (
        <LatestCommentCard
          key={comment.id}
          avatarImgSrc={comment.avatar}
          nickname={comment.nickname}
          content={comment.content}
          postSlug={comment.postSlug}
        />
      ))}
    </div>
  );
}

interface LatestCommentCardProps {
  avatarImgSrc: string;
  nickname: string;
  content: string;
  postSlug: string;
}

function LatestCommentCard({
  avatarImgSrc,
  nickname,
  content,
  postSlug,
}: LatestCommentCardProps) {
  return (
    <Link
      href={`/posts/${postSlug}#comments`}
      className="flex flex-col gap-2 py-2 bg-card text-card-foreground rounded-lg p-4 hover:bg-accent transition-colors animate-fadeIn"
    >
      <div className="flex items-center gap-2">
        <Avatar className="w-6 h-6">
          <AvatarImage src={avatarImgSrc} className="bg-sky-100" />
          <AvatarFallback>{nickname[0]}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-semibold">{nickname}</span>
      </div>
      <p className="text-sm text-foreground line-clamp-2">{content}</p>
      <p className="text-xs text-muted-foreground">
        {getPostTitleFromSlug(postSlug)}
      </p>
    </Link>
  );
}
