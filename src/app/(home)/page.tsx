import { Shell } from "@/components/shell";
import { Tags } from "./_components/tags";
import { Posts } from "@/components/posts";

export default async function Page({
  searchParams,
}: {
  searchParams: { tag: string[] };
}) {
  const tags = (await searchParams).tag;

  return (
    <Shell className="flex flex-col">
      <div className="flex">
        <div className="flex-1 flex flex-col gap-8 py-5 mb-10 md:pr-6">
          <div className="md:hidden">
            <Tags />
          </div>
          <Posts tags={tags} />
        </div>
        <div className="w-3xs px-6 pt-4 border-l hidden md:block">
          <div className="sticky top-20">
            <div className="font-semibold mb-4">태그</div>
            <Tags />
          </div>
        </div>
      </div>
    </Shell>
  );
}
