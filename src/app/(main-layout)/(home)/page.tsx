import React from "react";
import { Shell } from "@/components/shell";
import { getAllTags } from "../posts/utils";
import { TagList } from "./_components/tag-list";
import {
  RecentCommentList,
  RecentCommentListLoading,
} from "./_components/recent-comment-list";
import { PostPaginatedList } from "./_components/post-paginiated-list";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    tag: string[] | string | undefined;
    page: string | undefined;
  }>;
}) {
  const tags = getAllTags();
  return (
    <Shell className="flex flex-col">
      <div className="flex justify-evenly">
        <div className="mb-10 flex max-w-2xl flex-1 flex-col lg:pr-6 lg:pt-2">
          <div className="hidden items-center gap-1 lg:flex">
            <span className="text-muted-foreground text-sm font-semibold">
              최신 글
            </span>
          </div>
          <React.Suspense>
            <PostPaginatedList searchParams={searchParams} />
          </React.Suspense>
        </div>
        <div className="hidden w-80 border-l px-6 py-2 lg:flex lg:flex-col lg:gap-8">
          <div>
            <div className="text-muted-foreground mb-4 text-sm font-semibold">
              태그
            </div>
            <React.Suspense>
              <TagList tags={tags} />
            </React.Suspense>
          </div>
          <div>
            <div className="text-muted-foreground mb-4 text-sm font-semibold">
              최근 댓글
            </div>
            <React.Suspense fallback={<RecentCommentListLoading />}>
              <RecentCommentList />
            </React.Suspense>
          </div>
        </div>
      </div>
    </Shell>
  );
}
