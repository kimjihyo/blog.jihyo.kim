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
    })(),
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
                isPending && isSelected ? "bg-primary/80" : "",
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
                  setSelectedTags(newTags);

                  const params = new URLSearchParams(searchParams);
                  params.delete("tag");
                  params.delete("page");
                  newTags.forEach((t) => params.append("tag", t));

                  // tag가 아예 없으면 uri가 '/'으로 되고, 이걸로 router.push하게 되면
                  // 전체 페이지 리로드가 일어나는 이슈가 있었음.
                  // 따라서 parmas가 아무것도 없는 것을 방지하기 위해 일단 임시 해결책
                  if (newTags.length === 0) {
                    params.set("tag", "");
                  }

                  const queryString = params.toString();
                  const pathname = "/";
                  startTransition(() => {
                    router.push(`${pathname}?${queryString}`);
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
