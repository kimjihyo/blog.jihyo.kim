"use client";

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
  const isSelected = currentTags.includes(tag);

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
        const currentTags = params.getAll("tag");
        const isSelected = currentTags.includes(tag);

        if (isSelected) {
          // Remove tag if already selected
          const newTags = currentTags.filter((t) => t !== tag);
          params.delete("tag");
          newTags.forEach((t) => params.append("tag", t));
        } else {
          // Add new tag
          params.append("tag", tag);
        }

        router.push(`/?${params.toString()}`);
      }}
    >
      <button type="button">{tag}</button>
    </Badge>
  );
}
