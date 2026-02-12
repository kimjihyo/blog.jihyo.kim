import type { Metadata } from "next";
import { SearchClient } from "./_components/search-client";

export const metadata: Metadata = {
  title: "검색",
  description: "블로그 글 검색",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/search",
  },
};

export default function SearchPage() {
  return <SearchClient />;
}
