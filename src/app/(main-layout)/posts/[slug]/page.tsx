import * as React from "react";
import { Shell } from "@/components/shell";
import { getBlogPosts } from "../utils";
import { Metadata } from "next";
import { Image } from "@/components/ui/image";
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
      <div className="min-w-0 max-w-3xl">
        <div className="bg-card rounded-lg">
          <Image
            className="mb-8 h-auto w-full rounded-lg"
            width={1200}
            height={630}
            alt=""
            src={frontmatter.thumbnail}
          />
        </div>
        <div className="mb-4 flex items-center gap-1">
          {frontmatter.tags.map((tag: string) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <div className="space-y-2">
          <div className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm">
            <time dateTime={frontmatter.createdTime} className="block">
              {formatDate(frontmatter.createdTime)}
            </time>
          </div>
          <h1 className="text-2xl font-bold leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]">
            {frontmatter.title}
          </h1>
        </div>
        <article className="prose dark:prose-invert prose-headings:scroll-m-20 prose-a:font-normal prose-a:text-primary prose-a:underline-offset-4 prose-code:text-sm prose-code:font-medium my-10 max-w-full">
          <Post />
        </article>
        <div id="comments" className="border-t pb-20 pt-8">
          <div>
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="font-medium">댓글 {0}</div>
              <div className="text-muted-foreground text-sm">
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
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.summary,
    },
  };
}
