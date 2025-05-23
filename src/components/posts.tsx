import { allPostsSortedByDate } from "@/lib/allPostsSortedByDate";
import { PostCard } from "./post-card";
import * as React from "react";

interface PostsProps {
  searchParams: Promise<{ tag: string[] }>;
}

export async function Posts({ searchParams }: PostsProps) {
  const { tag } = await searchParams;

  return (
    <>
      {allPostsSortedByDate
        .filter((post) => {
          if (tag) {
            if (Array.isArray(tag)) {
              return tag.every((t) => post.tags.includes(t));
            }
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
