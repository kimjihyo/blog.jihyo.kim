import Link from "next/link";
import { badgeVariants } from "./ui/badge";

const testCategories = ["All (32)", "Algorithm (10)", "Blog (22)"];

export function Categories() {
  return (
    <ul className="flex flex-wrap gap-2">
      {testCategories.map((category) => (
        <li key={category}>
          <Link className={badgeVariants()} href="">
            {category}
          </Link>
        </li>
      ))}
    </ul>
  );
}
