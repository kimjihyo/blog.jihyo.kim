import {
  Context,
  Meta,
  defineCollection,
  defineConfig,
} from "@content-collections/core";
import rehypeHighlight from "rehype-highlight";
import { visit } from "unist-util-visit";

import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { Transformer, unified } from "unified";

// Define the types for MDast nodes
interface MDastNode {
  type: string;
  children?: MDastNode[];
  depth?: number;
  value?: string;
  data?: { hProperties?: { id?: string } };
}

type Document = {
  _meta: Meta;
  content: string;
};

// Define the structure of the Table of Contents (TOC)
// Use 'type' instead of 'interface' because content-collections does not treat interfaces as serializable.
type TOCEntry = {
  id: string;
  title: string;
  index: number;
  children?: TOCEntry[];
};

function addMetaToVFile(_meta: Meta) {
  return (): Transformer => (_, vFile) => {
    Object.assign(vFile.data, { _meta });
  };
}

async function compile(document: Document) {
  const toc: TOCEntry[] = [];
  const stack: { depth: number; entry: TOCEntry }[] = [];

  const generateTOC = () => {
    return (mdast: MDastNode) => {
      let index = 0;
      visit(mdast, "heading", (node: MDastNode) => {
        // Extract the title of the current heading
        const title = node.children && node.children[0]?.value;
        if (title) {
          // Create an id
          const id = `${document._meta.directory}-${index++}`;
          node.data = node.data || {};
          node.data.hProperties = { id };

          // Create the TOC entry
          const entry: TOCEntry = { id, title, index };
          const depth = node.depth ?? 1;
          // Remove deeper or equal levels from the stack
          while (stack.length > 0 && stack[stack.length - 1].depth >= depth) {
            stack.pop();
          }

          if (stack.length === 0) {
            toc.push(entry); // Top-level
          } else {
            const parent = stack[stack.length - 1].entry;
            if (!parent.children) parent.children = [];
            parent.children.push(entry); // Nested under its parent
          }

          // Add current heading to stack
          stack.push({ depth, entry });

          // // If there's a deeper level, append it to the current TOC entry
          // if (node.depth === 2) {
          //   toc.push(tocEntry);
          // } else if (node.depth === 3 && toc.length > 0) {
          //   // Check if last entry has children (level 2) and add to it
          //   const lastEntry = toc[toc.length - 1];
          //   if (!lastEntry.children) lastEntry.children = [];
          //   lastEntry.children.push(tocEntry);
          // }
        }
      });
    };
  };

  const builder = unified().use(remarkParse);
  builder.use(addMetaToVFile(document._meta));
  builder.use(generateTOC);
  builder.use(remarkRehype);
  builder.use(rehypeHighlight);

  const html = await builder.use(rehypeStringify).process(document.content);

  return {
    html: String(html),
    toc,
  };
}

// Remove all unnecessary keys from the document
// and return a new object containing only the keys
// that should trigger a regeneration if changed.
function createCacheKey(document: Document): Document {
  const { content, _meta } = document;
  return { content, _meta };
}

function compileMarkdown(
  { cache }: Pick<Context, "cache">,
  document: Document
) {
  const cacheKey = createCacheKey(document);
  return cache(cacheKey, (doc) => compile(doc), {
    key: "__markdown",
  });
}

const posts = defineCollection({
  name: "posts",
  directory: "./content/posts",
  include: "**/*.md",
  schema: (z) => ({
    title: z.string(),
    summary: z.string(),
    createdTime: z.string(),
    updatedTime: z.string(),
    tags: z.array(z.string()),
    thumbnail: z.string(),
  }),
  transform: async (document, context) => {
    const { html, toc } = await compileMarkdown(context, document);

    // This is a workaround to fix the path of the document on Windows.
    document._meta.path = document._meta.directory;

    return {
      ...document,
      createdTime: new Date(document.createdTime),
      updatedTime: new Date(document.updatedTime),
      html,
      toc,
    };
  },
});

const postMetas = defineCollection({
  name: "postMetas",
  directory: "./content/posts",
  include: "**/*.md",
  schema: (z) => ({
    title: z.string(),
    summary: z.string(),
    createdTime: z.string(),
    updatedTime: z.string(),
    tags: z.array(z.string()),
    thumbnail: z.string().optional(),
  }),
  transform: async (document) => {
    return {
      title: document.title,
      summary: document.summary,
      thumbnail: document.thumbnail,
      tags: document.tags,
      createdTime: new Date(document.createdTime),
      updatedTime: new Date(document.updatedTime),
    };
  },
});

const tags = defineCollection({
  name: "tags",
  directory: "./content/tags",
  include: "**/*.md",
  schema: (z) => ({}),
  transform: async (_, { documents }) => {
    const postList = await documents(postMetas);
    const tags = postList.flatMap((post) => post.tags);
    const uniqueTags = [...new Set(tags)];

    return {
      tags: uniqueTags,
    };
  },
});
export default defineConfig({
  collections: [posts, postMetas, tags],
});
