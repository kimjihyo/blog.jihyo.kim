import Link from "next/link";
import { badgeVariants } from "./ui/badge";
import { allTags } from "@/lib/allTags";

interface TagsParams {
  selected?: string;
}

export function Tags({ selected }: TagsParams) {
  return (
    <ul className="flex flex-wrap gap-2">
      {allTags.map((tag) => (
        <li key={tag}>
          <Link
            className={badgeVariants({
              variant: selected === tag ? "primary" : "default",
            })}
            href={`/posts/tags/${tag}`}
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
