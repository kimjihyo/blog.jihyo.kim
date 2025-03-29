import { Posts } from "@/components/posts";
import { Tags } from "@/components/tags";

interface TagsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: TagsPageProps) {
  const slug = decodeURIComponent((await params).slug);

  return (
    <div className="w-full max-w-5xl p-8 mx-auto">
      <Tags selected={slug} />
      <div className="py-8 flex flex-col gap-8">
        <Posts tag={slug} />
      </div>
    </div>
  );
}
