import { Shell } from "@/components/shell";
import { Tags } from "./_components/tags";
import { Posts } from "./_components/posts";
import * as React from "react";

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
        <div className="w-3xs px-6 pt-4 border-l hidden md:block">
          <div className="sticky top-20">
            <div className="font-semibold mb-4">태그</div>
            <Tags selectedTags={tagList} />
          </div>
        </div>
      </div>
    </Shell>
  );
}
