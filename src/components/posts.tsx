import { allPostsSortedByDate } from "@/lib/allPostsSortedByDate";
import { PostCard } from "./post-card";
import * as React from "react";

interface PostsProps {
  type?: string;
  tags?: string[] | string;
}

export function Posts({ type, tags }: PostsProps) {
  return (
    <>
      {allPostsSortedByDate
        .filter((post) => {
          if (type) {
            return post.type === type;
          }
          return true;
        })
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
