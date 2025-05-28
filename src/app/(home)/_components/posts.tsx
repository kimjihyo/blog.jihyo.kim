import { allPostsSortedByDate } from "@/lib/allPostsSortedByDate";
import { PostCard } from "./post-card";
import * as React from "react";
import {
  Pagination,
  PaginationNext,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PostsProps {
  tags: string[];
  numberOfPostsPerPage: number;
  currentPage: number;
}

export async function Posts({
  tags,
  numberOfPostsPerPage,
  currentPage,
}: PostsProps) {
  const filteredPosts = allPostsSortedByDate.filter((post) => {
    if (tags && tags.length > 0) {
      if (Array.isArray(tags)) {
        return tags.every((t) => post.tags.includes(t));
      }
      return post.tags.includes(tags);
    }
    return true;
  });

  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / numberOfPostsPerPage);

  if (totalPosts === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>검색 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      {filteredPosts
        .slice(
          (currentPage - 1) * numberOfPostsPerPage,
          currentPage * numberOfPostsPerPage
        )

        .map((post) => (
          <PostCard key={post._meta.path} post={post} />
        ))}

      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`?page=${currentPage - 1}${
                tags.length > 0 ? `&tag=${tags.join(",")}` : ""
              }`}
              aria-disabled={currentPage === 1}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => {
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href={`?page=${pageNum}${tags
                      .map((tag) => `&tag=${tag}`)
                      .join("")}`}
                    isActive={pageNum === currentPage}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            }
          )}

          <PaginationItem>
            <PaginationNext
              href={
                currentPage < totalPages
                  ? `?page=${currentPage + 1}${tags
                      .map((tag) => `&tag=${tag}`)
                      .join("")}`
                  : undefined
              }
              aria-disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
