import { Shell } from "@/components/shell";
import { Tags } from "./_components/tags";
import { Posts } from "./_components/posts";
import * as React from "react";
import { LatestComments } from "./_components/latest-comments";
import { LoadingLatestComments } from "./_components/loading-latest-comments";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    tag: string[] | string | undefined;
    page: string | undefined;
  }>;
}) {
  const { tag, page } = await searchParams;
  const currentPage = parseInt(page ?? "1");
  const tagList = Array.isArray(tag) ? tag : tag ? [tag] : [];

  return (
    <Shell className="flex flex-col">
      <div className="flex">
        <div className="flex-1 flex flex-col gap-8 mb-10 md:pr-6">
          <Posts
            tags={tagList}
            numberOfPostsPerPage={10}
            currentPage={currentPage}
          />
        </div>
        <div className="w-80 px-6 pt-4 border-l hidden md:flex md:flex-col md:gap-8">
          <div>
            <div className="font-semibold mb-4 text-muted-foreground text-sm">
              태그
            </div>
            <Tags selectedTags={tagList} />
          </div>
          <div>
            <div className="font-semibold mb-4 text-muted-foreground text-sm">
              최근 댓글
            </div>
            <React.Suspense fallback={<LoadingLatestComments />}>
              <LatestComments />
            </React.Suspense>
          </div>
        </div>
      </div>
    </Shell>
  );
}
