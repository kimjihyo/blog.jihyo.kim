import Link from "next/link";
import { badgeVariants } from "./ui/badge";
import { allTags } from "@/lib/allTags";

export function Tags() {
  return (
    <ul className="flex flex-wrap gap-2">
      {allTags.map((tag) => (
        <li key={tag}>
          <Link className={badgeVariants()} href="">
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
