"use client";

import * as React from "react";
import { RecentCommentListItem } from "./recent-comment-list-item";

type Comment = {
  id: string;
  nickname: string;
  content: string;
  avatar: string;
  postSlug: string;
  postTitle: string;
};

export function RecentCommentList() {
  const [comments, setComments] = React.useState<Comment[] | null>(null);

  React.useEffect(() => {
    fetch("/api/recent-comments")
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch(() => setComments([]));
  }, []);

  if (comments === null) {
    return <RecentCommentListSkeleton />;
  }

  return (
    <div
      className="animate-fade-in flex flex-col gap-4"
      style={{ animationFillMode: "both" }}
    >
      {comments.map((comment) => (
        <RecentCommentListItem
          key={comment.id}
          avatarImgSrc={comment.avatar}
          nickname={comment.nickname}
          content={comment.content}
          postSlug={comment.postSlug}
          postTitle={comment.postTitle}
        />
      ))}
    </div>
  );
}

export function RecentCommentListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-card text-card-foreground flex flex-col gap-2 rounded-lg p-4 py-2"
        >
          <div className="flex items-center gap-2">
            <div className="bg-foreground/5 h-6 w-6 animate-pulse rounded-full" />
            <div className="bg-foreground/5 h-4 w-20 animate-pulse rounded" />
          </div>
          <div className="bg-foreground/5 h-8 animate-pulse rounded" />
          <div className="bg-foreground/5 h-3 w-32 animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}
