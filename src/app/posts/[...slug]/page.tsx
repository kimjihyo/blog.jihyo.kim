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

export async function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post._meta.path.split("/") }));
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostFromParams(params);

  if (!post) {
    return notFound();
  }

  return (
    <div className="w-full max-w-5xl p-8 mx-auto">
      <div className="markdown">
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </div>
  );
}
