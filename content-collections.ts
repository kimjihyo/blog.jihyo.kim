import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMarkdown } from "@content-collections/markdown";
import rehypeHighlight from "rehype-highlight";

const posts = defineCollection({
  name: "posts",
  directory: "./content/posts",
  include: "**/*.md",
  schema: (z) => ({
    title: z.string(),
    summary: z.string(),
    date: z.string(),
    tags: z.array(z.string()),
    type: z.enum(["post", "translation"]),
    thumbnail: z.string().optional(),
  }),
  transform: async (document, context) => {
    const html = await compileMarkdown(context, document, {
      rehypePlugins: [rehypeHighlight],
    });
    return {
      ...document,
      date: new Date(document.date),
      html,
    };
  },
});

export default defineConfig({
  collections: [posts],
});
