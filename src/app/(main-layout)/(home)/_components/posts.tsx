import { AnimatedPostList } from "./animated-post-list";
import * as React from "react";
import {
  Pagination,
  PaginationNext,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getBlogPosts } from "@/app/(main-layout)/posts/utils";

interface PostsProps {
  searchParams: Promise<{
    tag: string[] | string | undefined;
    page: string | undefined;
  }>;
}

export async function Posts({ searchParams }: PostsProps) {
  const { tag, page: pageStr } = await searchParams;
  const pageSize = 8;
  const page = pageStr ? parseInt(pageStr, 10) : 1;
  const tagList = Array.isArray(tag) ? tag : tag ? [tag] : [];
  const allPosts = getBlogPosts();

  // Filter posts by tags if provided
  const filteredPosts =
    tagList.length > 0
      ? allPosts.filter((post) =>
          tagList.some((tag) => post.frontmatter.tags?.includes(tag)),
        )
      : allPosts;

  // Calculate pagination
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  // Generate page numbers for pagination UI
  const getPageNumbers = () => {
    const delta = 2;
    const pages = [];
    const startPage = Math.max(1, page - delta);
    const endPage = Math.min(totalPages, page + delta);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const buildPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    params.set("page", pageNum.toString());
    tagList.forEach((tag) => params.append("tag", tag));
    return `?${params.toString()}`;
  };

  return (
    <>
      <AnimatedPostList key={page} posts={paginatedPosts} />
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={page === 1 ? "" : buildPageUrl(page - 1)}
                aria-disabled={page === 1}
              />
            </PaginationItem>

            {pageNumbers.map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href={buildPageUrl(pageNum)}
                  isActive={pageNum === page}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href={page >= totalPages ? "" : buildPageUrl(page + 1)}
                aria-disabled={page >= totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
