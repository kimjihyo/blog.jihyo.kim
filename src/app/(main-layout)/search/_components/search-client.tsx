"use client";

import * as React from "react";
import { Shell } from "@/components/shell";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { SearchIcon } from "lucide-react";

type SearchEntry = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
};

export function SearchClient() {
  const [query, setQuery] = React.useState("");
  const [index, setIndex] = React.useState<SearchEntry[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/search-index.json")
      .then((res) => res.json())
      .then((data: SearchEntry[]) => {
        setIndex(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const results = React.useMemo(() => {
    if (!query.trim()) return index;
    const q = query.toLowerCase();
    return index.filter(
      (entry) =>
        entry.title.toLowerCase().includes(q) ||
        entry.summary.toLowerCase().includes(q) ||
        entry.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [query, index]);

  const isFiltering = query.trim().length > 0;

  return (
    <Shell className="flex flex-col">
      <div className="flex justify-evenly">
        <div className="flex max-w-2xl flex-1 flex-col lg:pr-6 lg:pt-2">
          <div className="mb-8">
            <h1 className="mb-2 text-2xl font-bold">검색</h1>
            <p className="text-muted-foreground text-sm">
              제목, 요약, 태그로 글을 찾을 수 있습니다.
            </p>
          </div>
          <div className="relative mb-6">
            <SearchIcon className="text-muted-foreground absolute left-3 top-1/2 size-5 -translate-y-1/2" />
            <Input
              type="search"
              placeholder="검색어를 입력하세요..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
          {isLoading ? (
            <div className="flex flex-col gap-4 py-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2 py-3">
                  <div className="bg-muted h-5 w-12 animate-pulse rounded-full" />
                  <div className="bg-muted h-5 w-3/4 animate-pulse rounded" />
                  <div className="bg-muted h-4 w-full animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="text-muted-foreground mb-4 text-sm">
                {isFiltering
                  ? `${results.length}개의 검색 결과`
                  : `전체 ${index.length}개의 글`}
              </div>
              {results.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground mb-2 text-lg">
                    검색 결과가 없습니다.
                  </p>
                  <p className="text-muted-foreground/60 text-sm">
                    다른 키워드로 검색해 보세요.
                  </p>
                </div>
              ) : (
                <ul>
                  {results.map((entry) => (
                    <li key={entry.slug}>
                      <Link
                        href={`/posts/${entry.slug}`}
                        className="active:scale-97 group block py-6 duration-300 ease-in-out"
                      >
                        <div className="mb-1.5 flex items-center gap-1">
                          {entry.tags.map((tag) => (
                            <Badge key={tag}>{tag}</Badge>
                          ))}
                        </div>
                        <h2 className="text-foreground group-hover:text-primary xs:text-xl mb-1.5 text-base font-semibold transition-colors">
                          {entry.title}
                        </h2>
                        <p className="text-muted-foreground text-sm sm:text-base">
                          {entry.summary}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </Shell>
  );
}
