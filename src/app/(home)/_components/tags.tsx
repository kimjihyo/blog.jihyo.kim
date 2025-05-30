"use client";

import { Badge } from "@/components/ui/badge";
import { useSearchParams, useRouter } from "next/navigation";
import * as React from "react";
import { usePostsLoading } from "./posts-loading-context";
interface TagsProps {
  tags: string[];
}

export function Tags({ tags }: TagsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();
  const { setIsLoading } = usePostsLoading();

  const [selectedTags, setSelectedTags] = React.useState<string[]>(
    (() => {
      const tag = searchParams.getAll("tag");
      if (!tag) return [];
      return Array.isArray(tag) ? tag : [tag];
    })()
  );

  const [optimisticSelectedTags, toggleOptimisticSelectedTag] =
    React.useOptimistic(selectedTags, (tags, newTag: string) => {
      if (tags.includes(newTag)) {
        return tags.filter((t) => t !== newTag);
      }
      return [...tags, newTag];
    });

  React.useEffect(() => {
    setIsLoading(isPending);
  }, [isPending, setIsLoading]);

  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const isSelected = optimisticSelectedTags.includes(tag);

        return (
          <li key={tag}>
            <Badge
              variant={isSelected ? "primary" : "default"}
              className="cursor-pointer hover:opacity-80"
              onClick={() => {
                startTransition(() => {
                  toggleOptimisticSelectedTag(tag);
                  startTransition(() => {
                    const params = new URLSearchParams(searchParams);
                    params.delete("tag");

                    const newTags = [...selectedTags];

                    if (selectedTags.includes(tag)) {
                      newTags.splice(newTags.indexOf(tag), 1);
                    } else {
                      newTags.push(tag);
                    }

                    newTags.forEach((t) => params.append("tag", t));
                    setSelectedTags(newTags);
                    router.push(`/?${params.toString()}`);
                  });
                });
              }}
            >
              {tag}
            </Badge>
          </li>
        );
      })}
    </ul>
  );
}
