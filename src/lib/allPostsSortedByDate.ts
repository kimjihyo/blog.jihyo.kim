import { allPosts } from "content-collections";

export const allPostsSortedByDate = allPosts.toSorted(
  (a, b) => b.date.getTime() - a.date.getTime()
);
