import { TagFilterButton } from "./tag-filter-button";
import { allTags } from "@/lib/allTags";

export function Tags() {
  return (
    <ul className="flex flex-wrap gap-2">
      {allTags.map((tag) => (
        <li key={tag}>
          <TagFilterButton tag={tag} />
        </li>
      ))}
    </ul>
  );
}
