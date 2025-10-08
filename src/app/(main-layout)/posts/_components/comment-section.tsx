"use client";

import * as React from "react";
import { CommentForm } from "./comment-form";
import { Comments } from "./comments";
import { LoadingCommentSection } from "./loading-comment-section";
import { useQuery } from "@tanstack/react-query";

interface CommentSectionProps {
  postSlug: string;
}

export function CommentSection({ postSlug }: CommentSectionProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["comments", postSlug],
    queryFn: async () => {
      const response = await fetch(`/posts/${postSlug}/comments`);
      const data = await response.json();
      return data;
    },
  });

  if (isLoading) {
    return <LoadingCommentSection />;
  }

  return (
    <div className="animate-fadeIn">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="font-medium">댓글 {0}</div>
        <div className="text-sm text-muted-foreground">
          댓글 관련 문의: kimjihyo0325@gmail.com
        </div>
      </div>
      <CommentForm postSlug={postSlug} />
      <Comments comments={data} />
    </div>
  );
}
