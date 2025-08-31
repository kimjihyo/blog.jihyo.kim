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
import { MobileTableOfContents } from "../_components/mobile-table-of-contents";
import Mdx from "../_components/mdx";

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
    <Shell className="relative gap-10 md:flex md:justify-evenly">
      <div className="max-w-3xl min-w-0">
        <div className="rounded-lg bg-card">
          <Image
            className="mb-8 h-auto w-full rounded-lg"
            priority
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
          <div className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <time dateTime={frontmatter.createdTime} className="block">
              {formatDate(frontmatter.createdTime)}
            </time>
          </div>
          <h1 className="text-2xl leading-tight font-bold tracking-tighter md:text-3xl lg:leading-[1.1]">
            {frontmatter.title}
          </h1>
        </div>
        <Mdx>
          <Post />
        </Mdx>
        <div id="comments" className="border-t pt-8 pb-20">
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
