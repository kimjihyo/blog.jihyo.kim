import { Metadata } from "next";
import { Shell } from "@/components/shell";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { allPosts } from "content-collections";
import { notFound } from "next/navigation";
import { TableOfContents } from "@/components/table-of-contents";
import Image from "next/image";

interface PostPageProps {
  params: Promise<{ slug: string[] }>;
}

async function getPostFromParams(params: PostPageProps["params"]) {
  const slug = (await params).slug?.join("/");
  const post = allPosts.find((post) => post._meta.path === slug);
  if (!post) {
    return null;
  }
  return post;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = await getPostFromParams(params);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
    },
  };
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post._meta.path.split("/") }));
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostFromParams(params);

  if (!post) {
    return notFound();
  }

  return (
    <Shell className="relative md:grid md:grid-cols-[1fr_230px] gap-10">
      <div className="min-w-0">
        <Image
          className="w-full h-auto rounded-lg mb-8 bg-card"
          width={1200}
          height={630}
          alt=""
          src={post.thumbnail!}
        />
        <div className="flex items-center gap-1 mb-4">
          {post.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center text-muted-foreground text-sm gap-1.5">
            <time dateTime={post.createdTime.toString()} className="block">
              {formatDate(post.createdTime)}
            </time>
          </div>
          <h1 className="font-bold leading-tight tracking-tighter lg:leading-[1.1] text-2xl md:text-3xl">
            {post.title}
          </h1>
        </div>
        <div className="markdown mb-14">
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
      </div>
      <div className="hidden sticky top-24 h-fit md:block border-l pl-6">
        {post.toc && <TableOfContents tocEntries={post.toc} />}
      </div>
    </Shell>
  );
}
