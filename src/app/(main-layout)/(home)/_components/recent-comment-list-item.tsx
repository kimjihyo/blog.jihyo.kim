"use client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RecentCommentListItemProps {
  avatarImgSrc: string;
  nickname: string;
  content: string;
  postSlug: string;
  postTitle: string;
}

export function RecentCommentListItem({
  avatarImgSrc,
  nickname,
  content,
  postSlug,
  postTitle,
}: RecentCommentListItemProps) {
  return (
    <Link
      href={`/posts/${postSlug}#comments`}
      className="bg-card text-card-foreground hover:bg-card-accent flex flex-col gap-2 rounded-lg p-4 py-2 transition-colors"
    >
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarImage
            alt="avatar-image"
            src={avatarImgSrc}
            className="bg-sky-100"
          />
          <AvatarFallback>{nickname[0]}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-semibold">{nickname}</span>
      </div>
      <p className="text-foreground line-clamp-2 text-sm">{content}</p>
      <p className="text-muted-foreground text-xs">{postTitle}</p>
    </Link>
  );
}
