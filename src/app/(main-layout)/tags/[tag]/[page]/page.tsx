import {
  getBlogPosts,
  getAllTags,
  getTagByName,
} from "@/app/(main-layout)/posts/utils";
import { PostListItem } from "@/app/(main-layout)/(home)/_components/post-list-item";
import { Shell } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationNext,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

const PAGE_SIZE = 8;
const ALL_TAG = "all";

function getPostsForTag(tag: string) {
  const allPosts = getBlogPosts();
  if (tag === ALL_TAG) return allPosts;
  return allPosts.filter((post) => post.frontmatter.tags?.includes(tag));
}

export default async function TagPaginatedPage({
  params,
}: {
  params: Promise<{ tag: string; page: string }>;
}) {
  const { tag: rawTag, page: pageStr } = await params;
  const tag = decodeURIComponent(rawTag);
  const page = parseInt(pageStr, 10);

  if (tag !== ALL_TAG && !getTagByName(tag)) {
    notFound();
  }

  const filteredPosts = getPostsForTag(tag);
  const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE);

  if (isNaN(page) || page < 1 || page > totalPages) {
    notFound();
  }

  const allTags = getAllTags();
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  const delta = 2;
  const startPage = Math.max(1, page - delta);
  const endPage = Math.min(totalPages, page + delta);
  const pageNumbers: number[] = [];
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  const totalPostCount =
    tag === ALL_TAG ? getBlogPosts().length : getTagByName(tag)!.count;

  return (
    <Shell className="flex flex-col">
      <div className="flex justify-evenly">
        <div className="mb-10 flex max-w-2xl flex-1 flex-col lg:pt-2 lg:pr-6">
          <div className="mb-6">
            <div className="mb-4 flex items-baseline gap-3">
              <h1 className="text-2xl font-bold">
                {tag === ALL_TAG ? "전체 글" : tag}
              </h1>
              <span className="text-sm text-muted-foreground">
                {totalPostCount}개의 글
              </span>
            </div>
            <ul className="flex flex-wrap gap-2">
              <li>
                <Badge
                  asChild
                  size="lg"
                  variant={tag === ALL_TAG ? "primary" : "default"}
                >
                  <Link href={`/tags/all/1`}>전체</Link>
                </Badge>
              </li>
              {allTags.map((t) => (
                <li key={t.name}>
                  <Badge
                    asChild
                    variant={t.name === tag ? "primary" : "default"}
                    size="lg"
                  >
                    <Link href={`/tags/${t.name}/1`}>{t.name}</Link>
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
          <div className="animate-fade-in">
            {paginatedPosts.map((post, index) => (
              <PostListItem key={post.slug} index={index} post={post} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={page === 1 ? "" : `/tags/${rawTag}/${page - 1}`}
                    aria-disabled={page === 1}
                  />
                </PaginationItem>
                {pageNumbers.map((pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href={`/tags/${rawTag}/${pageNum}`}
                      isActive={pageNum === page}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href={
                      page >= totalPages ? "" : `/tags/${rawTag}/${page + 1}`
                    }
                    aria-disabled={page >= totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </Shell>
  );
}

export function generateStaticParams() {
  const allPosts = getBlogPosts();
  const allTags = getAllTags();

  const params: { tag: string; page: string }[] = [];

  // "all" pages
  const allTotalPages = Math.ceil(allPosts.length / PAGE_SIZE);
  for (let i = 1; i <= allTotalPages; i++) {
    params.push({ tag: ALL_TAG, page: String(i) });
  }

  // Per-tag pages
  for (const tag of allTags) {
    const totalPages = Math.ceil(tag.count / PAGE_SIZE);
    for (let i = 1; i <= totalPages; i++) {
      params.push({ tag: tag.name, page: String(i) });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string; page: string }>;
}): Promise<Metadata> {
  const { tag: rawTag, page } = await params;
  const tag = decodeURIComponent(rawTag);
  const label = tag === ALL_TAG ? "전체 글" : `${tag} 태그`;
  return {
    title: `${label} - ${page}페이지`,
    description: `${label} 목록 ${page}페이지`,
  };
}
