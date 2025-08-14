import { Shell } from "@/components/shell";
import { Tags } from "./_components/tags";
import { Posts } from "./_components/posts";
import * as React from "react";
import { LatestComments } from "./_components/latest-comments";
import { LoadingLatestComments } from "./_components/loading-latest-comments";
import { Banner } from "./_components/banner";
import { PostsLabel } from "./_components/posts-label";
import { getAllTags } from "@/app/posts/utils";

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
      <div className="mb-6">
        <Banner />
      </div>
      <div className="flex">
        <div className="flex-1 flex flex-col mb-10 lg:pr-6 lg:pt-2">
          <PostsLabel />
          <React.Suspense>
            <Posts searchParams={searchParams} numberOfPostsPerPage={5} />
          </React.Suspense>
        </div>
        <div className="w-80 px-6 py-2 border-l hidden lg:flex lg:flex-col lg:gap-8">
          <div>
            <div className="font-semibold mb-4 text-muted-foreground text-sm">
              태그
            </div>
            <React.Suspense>
              <Tags tags={tags} />
            </React.Suspense>
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
