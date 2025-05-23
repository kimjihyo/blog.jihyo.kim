"use client";

import { Badge } from "@/components/ui/badge";
import { allTags } from "@/lib/allTags";
import { useRouter, useSearchParams } from "next/navigation";

export function Tags() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentTags = params.getAll("tag");

    if (currentTags.includes(tag)) {
      // Remove tag if already selected
      params.delete("tag");
      currentTags
        .filter((t) => t !== tag)
        .forEach((t) => params.append("tag", t));
    } else {
      // Add new tag
      params.append("tag", tag);
    }

    router.push(`?${params.toString()}`);
  };

  const selectedTags = searchParams.getAll("tag");

  return (
    <ul className="flex flex-wrap gap-2">
      {allTags.map((tag) => (
        <li key={tag}>
          <Badge
            variant={selectedTags.includes(tag) ? "primary" : "default"}
            className="cursor-pointer hover:opacity-80"
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
