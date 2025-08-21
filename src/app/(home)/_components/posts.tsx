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
import { getBlogPosts } from "@/app/posts/utils";

interface PostsProps {
  searchParams: Promise<{
    tag: string[] | string | undefined;
    page: string | undefined;
  }>;
  numberOfPostsPerPage: number;
}

export async function Posts({
  searchParams,
  numberOfPostsPerPage,
}: PostsProps) {
  // await new Promise((resolve) => setTimeout(() => resolve(null), 1000));
  const { tag, page } = await searchParams;
  const currentPage = parseInt(page ?? "1");
  const tagList = Array.isArray(tag) ? tag : tag ? [tag] : [];

  const allPosts = getBlogPosts();

  // Filter posts by tags if provided
  const filteredPosts =
    tagList.length > 0
      ? allPosts.filter((post) =>
          tagList.some((tag) => post.frontmatter.tags?.includes(tag))
        )
      : allPosts;

  // Calculate pagination
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / numberOfPostsPerPage);
  const startIndex = (currentPage - 1) * numberOfPostsPerPage;
  const endIndex = startIndex + numberOfPostsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  // Generate page numbers for pagination UI
  const getPageNumbers = () => {
    const delta = 2;
    const pages = [];
    const startPage = Math.max(1, currentPage - delta);
    const endPage = Math.min(totalPages, currentPage + delta);

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
                href={currentPage === 1 ? "" : buildPageUrl(currentPage - 1)}
                aria-disabled={currentPage === 1}
              />
            </PaginationItem>

            {pageNumbers.map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href={buildPageUrl(pageNum)}
                  isActive={pageNum === currentPage}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href={
                  currentPage >= totalPages ? "" : buildPageUrl(currentPage + 1)
                }
                aria-disabled={currentPage >= totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
