import type { Metadata } from "next";
import { SearchClient } from "./_components/search-client";

export const metadata: Metadata = {
  title: "검색",
  description: "블로그 글 검색",
};

export default function SearchPage() {
  return <SearchClient />;
}
