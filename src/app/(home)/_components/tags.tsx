"use client";

import { Badge } from "@/components/ui/badge";
import { useSearchParams, useRouter } from "next/navigation";
import * as React from "react";
import type { Tag } from "@/app/posts/utils";
import { cn } from "@/lib/utils";

interface TagsProps {
  tags: Tag[];
}

export function Tags({ tags }: TagsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();

  const [selectedTags, setSelectedTags] = React.useState<string[]>(
    (() => {
      const tag = searchParams.getAll("tag");
      if (!tag) return [];
      return Array.isArray(tag) ? tag : [tag];
    })()
  );

  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag.name);
        return (
          <li key={tag.name}>
            <Badge
              variant={isSelected ? "primary" : "default"}
              className={cn(
                "cursor-pointer transition-colors",
                isPending && isSelected ? "bg-primary/80" : ""
              )}
              asChild
            >
              <button
                type="button"
                onClick={() => {
                  const newTags = [...selectedTags];

                  if (selectedTags.includes(tag.name)) {
                    newTags.splice(newTags.indexOf(tag.name), 1);
                  } else {
                    newTags.push(tag.name);
                  }
                  const params = new URLSearchParams(searchParams);
                  params.delete("tag");
                  params.delete("page");
                  newTags.forEach((t) => params.append("tag", t));
                  setSelectedTags(newTags);
                  const queryString = params.toString();
                  const pathname = "/";
                  startTransition(() => {
                    router.push(
                      queryString ? `${pathname}?${queryString}` : pathname
                    );
                  });
                }}
              >
                {tag.name}
              </button>
            </Badge>
          </li>
        );
      })}
    </ul>
  );
}
