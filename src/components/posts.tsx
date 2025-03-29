import { allPosts } from "content-collections";
import { PostCard } from "./post-card";

interface PostsProps {
  type?: string;
  tag?: string;
}

export function Posts({ type, tag }: PostsProps) {
  return (
    <>
      {allPosts
        .filter((post) => {
          if (type) {
            return post.type === type;
          }
          return true;
        })
        .filter((post) => {
          if (tag) {
            return post.tags.includes(tag);
          }
          return true;
        })
        .map((post) => (
          <PostCard key={post._meta.path} post={post} />
        ))}
    </>
  );
}
