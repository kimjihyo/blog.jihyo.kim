import { Metadata } from "next";
import { Shell } from "@/components/shell";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { allPosts } from "content-collections";
import { notFound } from "next/navigation";

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
    <Shell>
      <div className="flex items-center gap-1 mb-4">
        {post.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      <div className="space-y-2">
        <div className="flex flex-wrap items-center text-muted-foreground text-sm gap-1.5">
          <time dateTime={post.date.toString()} className="block">
            {formatDate(post.date)}
          </time>
        </div>
        <h1 className="font-bold leading-tight tracking-tighter lg:leading-[1.1] text-2xl md:text-3xl">
          {post.title}
        </h1>
      </div>
      <div className="markdown mb-14">
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </Shell>
  );
}
