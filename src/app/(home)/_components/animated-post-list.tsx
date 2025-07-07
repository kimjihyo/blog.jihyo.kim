"use client";
import { AnimatePresence } from "motion/react";
import { PostCard } from "./post-card";
import { motion } from "motion/react";

interface AnimatedPostListProps {
  posts: any[];
}

export function AnimatedPostList({ posts }: AnimatedPostListProps) {
  return (
    <AnimatePresence mode="popLayout">
      {posts.map((post, index) => (
        <motion.div
          className="will-change-[transform,opacity]"
          key={post._meta.path}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{
            type: "spring",
            duration: 2,
            delay: index * 0.1,
            bounce: 0,
          }}
          style={{ originY: 0 }}
          layout
        >
          <PostCard post={post} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
