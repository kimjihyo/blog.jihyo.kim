import { Shell } from "@/components/shell";
import { Tags } from "./_components/tags";
import { Posts } from "@/components/posts";
import * as React from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tag: string[] }>;
}) {
  return (
    <Shell className="flex flex-col">
      <div className="flex">
        <div className="flex-1 flex flex-col gap-8 mb-10 md:pr-6">
          <Posts searchParams={searchParams} />
        </div>
        <div className="w-3xs px-6 pt-4 border-l hidden md:block">
          <div className="sticky top-20">
            <div className="font-semibold mb-4">태그</div>
            <Tags searchParams={searchParams} />
          </div>
        </div>
      </div>
    </Shell>
  );
}
