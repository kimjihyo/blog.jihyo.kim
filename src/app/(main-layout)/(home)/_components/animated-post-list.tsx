"use client";
import { AnimatePresence, motion } from "motion/react";
import { PostCard } from "./post-card";

interface AnimatedPostListProps {
  posts: {
    frontmatter: Partial<{
      tags: string[];
      createdTime: string;
      thumbnail: string;
      summary: string;
      updatedTime: string;
      title: string;
    }>;
    slug: string;
  }[];
}

export function AnimatedPostList({ posts }: AnimatedPostListProps) {
  return (
    <AnimatePresence mode="popLayout">
      {posts.map((post, index) => (
        <motion.div
          className="will-change-[transform]"
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
          <PostCard index={index} post={post} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
