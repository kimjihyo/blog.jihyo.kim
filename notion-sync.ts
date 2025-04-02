import { Client, isFullPage } from "@notionhq/client";
import { loadEnvConfig } from "@next/env";
import { NotionConverter } from "notion-to-md";
import { MDXRenderer } from "notion-to-md/plugins/renderer";
import { DefaultExporter } from "notion-to-md/plugins/exporter";
import { allPosts } from "content-collections";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

async function sync() {
  const { NOTION_TOKEN, NOTION_DB_ID } = process.env;

  if (!NOTION_TOKEN || !NOTION_DB_ID) {
    throw new Error(
      "Env variable NOTION_TOKEN or NOTION_DB_ID is not defined."
    );
  }

  const notion = new Client({ auth: NOTION_TOKEN });

  try {
    const { results: pages } = await notion.databases.query({
      database_id: NOTION_DB_ID,
    });
    for (const page of pages) {
      if (!isFullPage(page)) continue;
      const pageId = page.id;

      const { tags: tagsProp } = page.properties;

      if (
        tagsProp.type === "multi_select" &&
        tagsProp.multi_select
          .map((select) => select.name)
          .includes("DON'T SYNC")
      ) {
        continue;
      }

      const existingPost = allPosts.find(
        (post) => post._meta.directory === page.id
      );

      if (
        existingPost &&
        existingPost.updatedTime <= new Date(page.last_edited_time)
      ) {
        continue;
      }

      const n2m = new NotionConverter(notion)
        .withRenderer(
          new MDXRenderer({
            frontmatter: true,
          })
        )
        .withExporter(
          new DefaultExporter({
            outputType: "file",
            outputPath: `content/posts/${pageId}/index.md`,
          })
        );

      await n2m.convert(pageId);
    }
  } catch (error) {
    console.error(error);
  }
}

sync();
