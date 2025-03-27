import { allPosts } from "content-collections";

// Collect all tags
const tagsSet = new Set<string>();

allPosts.forEach((post) => {
  if (post.tags) {
    post.tags.forEach((tag) => tagsSet.add(tag));
  }
});

export const allTags = Array.from(tagsSet);
