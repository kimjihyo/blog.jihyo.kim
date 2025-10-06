import { Shell } from "@/components/shell";
import { Tags } from "./_components/tags";
import { Posts } from "./_components/posts";
import * as React from "react";
import { LatestComments } from "./_components/latest-comments";
import { LoadingLatestComments } from "./_components/loading-latest-comments";
import { PostsLabel } from "./_components/posts-label";
import { getAllTags } from "@/app/(main-layout)/posts/utils";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    tag: string[] | string | undefined;
    page: string | undefined;
  }>;
}) {
  const { tag, page: pageStr } = await searchParams;
  const page = pageStr ? parseInt(pageStr, 10) : 1;
  const tags = getAllTags();
  return (
    <Shell className="flex flex-col">
      <div className="flex justify-evenly">
        <div className="mb-10 flex max-w-2xl flex-1 flex-col lg:pt-2 lg:pr-6">
          <PostsLabel />
          <Posts page={page} tag={tag} pageSize={8} />
        </div>
        <div className="hidden w-80 border-l px-6 py-2 lg:flex lg:flex-col lg:gap-8">
          <div>
            <div className="mb-4 text-sm font-semibold text-muted-foreground">
              태그
            </div>
            <React.Suspense>
              <Tags tags={tags} />
            </React.Suspense>
          </div>
          <div>
            <div className="mb-4 text-sm font-semibold text-muted-foreground">
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
