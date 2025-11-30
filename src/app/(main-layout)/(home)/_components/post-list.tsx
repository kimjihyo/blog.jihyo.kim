"use client";

import { AnimatePresence, motion } from "motion/react";
import { PostListItem } from "./post-list-item";

interface PostListProps {
  list: {
    slug: string;
    frontmatter: Partial<{
      tags: string[];
      createdTime: string;
      thumbnail: string;
      summary: string;
      updatedTime: string;
      title: string;
    }>;
  }[];
}

export function PostList({ list }: PostListProps) {
  return (
    <AnimatePresence mode="popLayout">
      {list.map((post, index) => (
        <motion.div
          className="will-change-transform"
          key={post.slug}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            type: "spring",
            duration: 1,
            delay: index * 0.1,
            bounce: 0,
          }}
          style={{ originY: 0 }}
          layout
        >
          <PostListItem index={index} post={post} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
