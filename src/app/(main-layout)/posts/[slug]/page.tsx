import * as React from "react";
import { Shell } from "@/components/shell";
import { getBlogPosts } from "../utils";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { TableOfContentsPc } from "../_components/table-of-contents-pc";
import { TableOfContentsMobile } from "../_components/table-of-contents-mobile";
import { notFound } from "next/navigation";
import { CommentForm } from "../_components/comment-form";
import { CommentList, CommentListSkeleton } from "../_components/comment-list";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = getBlogPosts().find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  const {
    default: Post,
    frontmatter,
    tableOfContents,
  } = await import(`@/../content/${slug}.mdx`);

  return (
    <Shell className="relative gap-10 md:flex md:justify-evenly">
      <div className="max-w-3xl min-w-0">
        <div className="space-y-5">
          <h1 className="text-3xl leading-tight font-bold tracking-tighter md:text-5xl lg:leading-[1.1]">
            {frontmatter.title}
          </h1>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
              <time dateTime={frontmatter.createdTime} className="block">
                {formatDate(frontmatter.createdTime)}
              </time>
            </div>
            <div className="mb-4 flex items-center gap-1">
              {frontmatter.tags.map((tag: string) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </div>
        </div>
        <article className="prose mt-14 mb-10 max-w-full dark:prose-invert prose-headings:scroll-m-20 prose-a:font-normal prose-a:text-primary prose-a:underline-offset-4 prose-code:text-sm prose-code:font-medium">
          <Post />
        </article>
        <div id="comments" className="border-t border-border pt-8 pb-20">
          <div>
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="font-medium">댓글 {0}</div>
              <div className="text-sm text-muted-foreground">
                댓글 관련 문의: kimjihyo0325@gmail.com
              </div>
            </div>
            <React.Suspense>
              <CommentForm slug={slug} />
            </React.Suspense>
            <React.Suspense fallback={<CommentListSkeleton />}>
              <CommentList slug={slug} />
            </React.Suspense>
          </div>
        </div>
        {tableOfContents && (
          <TableOfContentsMobile tocEntries={tableOfContents} />
        )}
      </div>
      {tableOfContents && <TableOfContentsPc tocEntries={tableOfContents} />}
    </Shell>
  );
}

export function generateStaticParams() {
  const posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const post = getBlogPosts().find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  const { frontmatter } = await import(`@/../content/${slug}.mdx`);

  return {
    title: frontmatter.title,
    description: frontmatter.summary,
    alternates: {
      canonical: `/posts/${slug}`,
    },
    openGraph: {
      type: "article",
      title: frontmatter.title,
      description: frontmatter.summary,
      publishedTime: frontmatter.createdTime,
      modifiedTime: frontmatter.updatedTime,
      authors: ["Jihyo Kim"],
      tags: frontmatter.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.summary,
    },
  };
}
