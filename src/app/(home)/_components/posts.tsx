import { allPostsSortedByDate } from "@/lib/allPostsSortedByDate";
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
  const { tag, page } = await searchParams;
  const currentPage = parseInt(page ?? "1");
  const tagList = Array.isArray(tag) ? tag : tag ? [tag] : [];

  const filteredPosts = allPostsSortedByDate.filter((post) => {
    if (tagList && tagList.length > 0) {
      if (Array.isArray(tagList)) {
        return tagList.every((t) => post.tags.includes(t));
      }
      return post.tags.includes(tagList);
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

  const posts = filteredPosts.slice(
    (currentPage - 1) * numberOfPostsPerPage,
    currentPage * numberOfPostsPerPage
  );

  return (
    <>
      <AnimatedPostList key={page} posts={posts} />
      {/* {filteredPosts
        .slice(
          (currentPage - 1) * numberOfPostsPerPage,
          currentPage * numberOfPostsPerPage
        )

        .map((post) => (
          <PostCard key={post._meta.path} post={post} />
        ))} */}

      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={
                currentPage === 1
                  ? ""
                  : `?page=${currentPage - 1}${
                      tagList.length > 0 ? `&tag=${tagList.join(",")}` : ""
                    }`
              }
              aria-disabled={currentPage === 1}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => {
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href={`?page=${pageNum}${tagList
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
                  ? `?page=${currentPage + 1}${tagList
                      .map((tag) => `&tag=${tag}`)
                      .join("")}`
                  : ""
              }
              aria-disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
