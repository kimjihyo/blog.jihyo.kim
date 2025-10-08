import postsData from "../../../../.data/posts.json";
import tagsData from "../../../../.data/tags.json";

export type Frontmatter = {
  tags: string[];
  createdTime: string;
  thumbnail: string;
  summary: string;
  updatedTime: string;
  title: string;
};

export type BlogPost = {
  frontmatter: Frontmatter;
  slug: string;
};

export type Tag = {
  name: string;
  count: number;
};

export function getBlogPosts(): BlogPost[] {
  // Return pre-generated static data - no file system access needed!
  return postsData as BlogPost[];
}

export function getAllTags(): Tag[] {
  // Return pre-generated static data - no computation needed!
  return tagsData as Tag[];
}

export function getTagByName(tagName: string): Tag | undefined {
  return getAllTags().find((tag) => tag.name === tagName);
}

export function getPopularTags(limit: number = 10): Tag[] {
  return getAllTags().slice(0, limit);
}
