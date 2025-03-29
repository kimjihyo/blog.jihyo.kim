import { Posts } from "@/components/posts";
import { Shell } from "@/components/shell";
import { Tags } from "@/components/tags";

interface TagsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: TagsPageProps) {
  const slug = decodeURIComponent((await params).slug);

  return (
    <Shell>
      <Tags selected={slug} />
      <div className="py-8 flex flex-col gap-8">
        <Posts tag={slug} />
      </div>
    </Shell>
  );
}
