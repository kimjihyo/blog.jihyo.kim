import { allPosts } from "content-collections";

export const allPostsSortedByDate = allPosts.toSorted(
  (a, b) => b.createdTime.getTime() - a.createdTime.getTime()
);
