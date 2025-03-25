import { allPosts } from "content-collections";
import { PostCard } from "./post-card";

export function Posts() {
  return (
    <>
      {allPosts.map((post) => (
        <PostCard key={post._meta.path} post={post} />
      ))}
    </>
  );
}
