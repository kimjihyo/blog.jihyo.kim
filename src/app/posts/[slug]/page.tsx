import * as React from "react";
import { Shell } from "@/components/shell";
import { getBlogPosts } from "../utils";
import { Metadata } from "next";
import { Image } from "@/components/ui/image";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { LoadingCommentSection } from "../_components/loading-comment-section";
import { CommentSection } from "../_components/comment-section";
import { TableOfContents } from "../_components/table-of-contents";
import { markOrder } from "../_components/toc-core";
import { MobileTableOfContents } from "../_components/mobile-table-of-contents";

export const experimental_ppr = true;

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const {
    default: Post,
    frontmatter,
    tableOfContents,
  } = await import(`@/../content/${slug}.mdx`);

  return (
    <Shell className="relative md:grid md:grid-cols-[1fr_230px] gap-10">
      <div className="min-w-0">
        <div className="rounded-lg bg-card">
          <Image
            className="w-full h-auto rounded-lg mb-8"
            priority
            width={1200}
            height={630}
            alt=""
            src={frontmatter.thumbnail}
          />
        </div>
        <div className="flex items-center gap-1 mb-4">
          {frontmatter.tags.map((tag: string) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center text-muted-foreground text-sm gap-1.5">
            <time dateTime={frontmatter.createdTime} className="block">
              {formatDate(frontmatter.createdTime)}
            </time>
          </div>
          <h1 className="font-bold leading-tight tracking-tighter lg:leading-[1.1] text-2xl md:text-3xl">
            {frontmatter.title}
          </h1>
        </div>
        <Post />
        <div id="comments" className="pt-8 pb-20 border-t">
          <React.Suspense fallback={<LoadingCommentSection />}>
            <CommentSection postSlug={slug} />
          </React.Suspense>
        </div>
        {tableOfContents && (
          <React.Suspense>
            <MobileTableOfContents tocEntries={tableOfContents} />
          </React.Suspense>
        )}
      </div>
      {tableOfContents && <TableOfContents tocEntries={tableOfContents} />}
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
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
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

export const dynamicParams = false;
