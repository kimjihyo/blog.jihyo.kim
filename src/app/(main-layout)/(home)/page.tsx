import Link from "next/link";
import { Shell } from "@/components/shell";
import { getBlogPosts, getAllTags } from "../posts/utils";
import { PostListItem } from "./_components/post-list-item";
import { RecentCommentList } from "./_components/recent-comment-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Page() {
  const posts = getBlogPosts().slice(0, 8);
  const tags = getAllTags();

  return (
    <Shell className="flex flex-col">
      <div className="flex">
        <div className="mb-10 flex flex-1 flex-col lg:pt-2 lg:pr-6">
          <div className="hidden items-center gap-1 lg:flex">
            <span className="text-sm font-semibold text-muted-foreground">
              최신 글
            </span>
          </div>
          <div>
            {posts.map((post, index) => (
              <PostListItem key={post.slug} index={index} post={post} />
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Button asChild variant="secondary">
              <Link href="/tags/all/1">전체 글 보기 →</Link>
            </Button>
          </div>
        </div>
        <div className="hidden w-80 border-l border-border px-6 py-2 lg:flex lg:flex-col lg:gap-8">
          <div>
            <div className="mb-4 text-sm font-semibold text-muted-foreground">
              태그
            </div>
            <ul className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li key={tag.name}>
                  <Badge asChild>
                    <Link href={`/tags/${tag.name}/1`}>{tag.name}</Link>
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-4 text-sm font-semibold text-muted-foreground">
              최근 댓글
            </div>
            <RecentCommentList />
          </div>
        </div>
      </div>
    </Shell>
  );
}
