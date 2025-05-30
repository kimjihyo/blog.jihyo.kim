import { Shell } from "@/components/shell";
import { Tags } from "./_components/tags";
import { Posts } from "./_components/posts";
import * as React from "react";
import { LatestComments } from "./_components/latest-comments";
import { LoadingLatestComments } from "./_components/loading-latest-comments";
import { Banner } from "./_components/banner";
import { allTags } from "@/lib/allTags";
import { Suspense } from "react";
import { PostsLoadingProvider } from "./_components/posts-loading-context";
import { PostsLabel } from "./_components/posts-label";

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
      <div className="mb-6">
        <Banner />
      </div>
      <PostsLoadingProvider>
        <div className="flex">
          <div className="flex-1 flex flex-col mb-10 lg:pr-6 lg:pt-2">
            <PostsLabel />
            <Posts
              tags={tagList}
              numberOfPostsPerPage={10}
              currentPage={currentPage}
            />
          </div>
          <div className="w-80 px-6 py-2 border-l hidden lg:flex lg:flex-col lg:gap-8">
            <div>
              <div className="font-semibold mb-4 text-muted-foreground text-sm">
                태그
              </div>
              <Suspense>
                <Tags tags={allTags} />
              </Suspense>
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
      </PostsLoadingProvider>
    </Shell>
  );
}
