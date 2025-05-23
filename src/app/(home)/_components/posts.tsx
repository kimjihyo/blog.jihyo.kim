import { allPostsSortedByDate } from "@/lib/allPostsSortedByDate";
import { PostCard } from "../../../components/post-card";
import * as React from "react";

interface PostsProps {
  searchParams: Promise<{ tag: string[] }>;
}

export async function Posts({ searchParams }: PostsProps) {
  const tags = (await searchParams).tag;

  return (
    <>
      {allPostsSortedByDate
        .filter((post) => {
          if (tags) {
            if (Array.isArray(tags)) {
              return tags.every((tag) => post.tags.includes(tag));
            }
            return post.tags.includes(tags);
          }
          return true;
        })
        .map((post) => (
          <PostCard key={post._meta.path} post={post} />
        ))}
    </>
  );
}
