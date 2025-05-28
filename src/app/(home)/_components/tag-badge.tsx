"use client";

import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";

interface TagBadgeProps {
  tag: string;
  isSelected: boolean;
}

export function TagBadge({ tag, isSelected }: TagBadgeProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Badge
      variant={isSelected ? "primary" : "default"}
      className="cursor-pointer hover:opacity-80"
      onClick={() => {
        const params = new URLSearchParams(searchParams.toString());
        const currentTags = params.getAll("tag");

        if (isSelected) {
          // Remove this tag
          const remainingTags = currentTags.filter((t) => t !== tag);
          params.delete("tag");
          remainingTags.forEach((t) => params.append("tag", t));
        } else {
          // Add this tag while preserving existing ones
          params.append("tag", tag);
        }

        // Reset page to 1 whenever tags change
        params.set("page", "1");

        router.push(`?${params.toString()}`);
      }}
    >
      {tag}
    </Badge>
  );
}
