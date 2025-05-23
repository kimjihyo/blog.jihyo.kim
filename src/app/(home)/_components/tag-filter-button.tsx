"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface TagFilterButtonProps {
  tag: string;
}

export function TagFilterButton({ tag }: TagFilterButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTags = searchParams.getAll("tag");
  const [optimisticTags, setOptimisticTags] = React.useOptimistic(
    currentTags,
    (tags: string[], tag: string) => {
      return tags.includes(tag)
        ? tags.filter((t) => t !== tag)
        : [...tags, tag];
    }
  );
  const isSelected = optimisticTags.includes(tag);

  return (
    <Badge
      variant={isSelected ? "primary" : "default"}
      asChild
      className={cn(
        "hover:cursor-pointer",
        isSelected ? "hover:bg-primary/80" : "hover:bg-badge-default/80"
      )}
      onClick={() => {
        const params = new URLSearchParams(searchParams);
        params.delete("tag");

        React.startTransition(() => {
          setOptimisticTags(tag);
        });

        const newTags = optimisticTags.includes(tag)
          ? optimisticTags.filter((t) => t !== tag)
          : [...optimisticTags, tag];

        newTags.forEach((t) => params.append("tag", t));
        router.push(`/?${params.toString()}`);
      }}
    >
      <button type="button">{tag}</button>
    </Badge>
  );
}
