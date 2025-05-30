"use client";

import { usePostsLoading } from "./posts-loading-context";
import { Loader } from "lucide-react";
export function PostsLabel() {
  const { isLoading } = usePostsLoading();

  return (
    <div className="hidden lg:flex items-center gap-1">
      <span className="text-muted-foreground text-sm font-semibold">
        최신 글
      </span>
      {isLoading && (
        <span className="inline-block animate-spin">
          <Loader className="w-4 h-4 text-blue-500" />
        </span>
      )}
    </div>
  );
}
