"use server";

import { allPosts, allTags } from "content-collections";

export async function getAllPostsSortedByDate() {
  return allPosts.toSorted(
    (a, b) => b.createdTime.getTime() - a.createdTime.getTime()
  );
}

export async function getAllTags() {
  return allTags[0].tags;
}
