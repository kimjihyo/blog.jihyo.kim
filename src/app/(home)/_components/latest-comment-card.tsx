"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { motion } from "motion/react";

interface LatestCommentCardProps {
  avatarImgSrc: string;
  nickname: string;
  content: string;
  postSlug: string;
  postTitle: string;
  index: number;
}

export function LatestCommentCard({
  avatarImgSrc,
  nickname,
  content,
  postSlug,
  postTitle,
  index,
}: LatestCommentCardProps) {
  return (
    <motion.div
      className="will-change-[transform,opacity]"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        type: "spring",
        duration: 1,
        delay: index * 0.1,
        bounce: 0,
      }}
    >
      <Link
        href={`/posts/${postSlug}#comments`}
        className="flex flex-col gap-2 py-2 bg-card text-card-foreground rounded-lg p-4 hover:bg-accent transition-colors"
      >
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={avatarImgSrc} className="bg-sky-100" />
            <AvatarFallback>{nickname[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold">{nickname}</span>
        </div>
        <p className="text-sm text-foreground line-clamp-2">{content}</p>
        <p className="text-xs text-muted-foreground">{postTitle}</p>
      </Link>
    </motion.div>
  );
}
