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
          key={post._meta.path}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{
            type: "spring",
            duration: 0.6,
            delay: index * 0.12,
            stiffness: 100,
            damping: 20,
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
