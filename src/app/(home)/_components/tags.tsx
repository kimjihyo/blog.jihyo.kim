import * as React from "react";
import { allTags } from "@/lib/allTags";
import { TagBadge } from "./tag-badge";

interface TagsProps {
  searchParams: Promise<{ tag: string[] | string | undefined }>;
}

export async function Tags({ searchParams }: TagsProps) {
  const selectedTags = (await searchParams).tag;

  return (
    <React.Suspense>
      <ul className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <li key={tag}>
            <TagBadge
              tag={tag}
              isSelected={selectedTags?.includes(tag) ?? false}
            />
          </li>
        ))}
      </ul>
    </React.Suspense>
  );
}
