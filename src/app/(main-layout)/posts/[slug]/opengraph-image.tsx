import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getBlogPosts } from "../utils";

export const alt = "블로그 포스트 썸네일";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { frontmatter } = await import(`@/../content/${slug}.mdx`);

  const pretendardBold = await readFile(
    join(process.cwd(), "src/assets/fonts/Pretendard-SemiBold.ttf"),
  );
  const pretendardBlack = await readFile(
    join(process.cwd(), "src/assets/fonts/Pretendard-Black.ttf"),
  );

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        backgroundImage: "linear-gradient(to bottom right, #60a5fa, #1d4ed8)",
        fontFamily: "Pretendard",
        padding: "60px 80px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: "52px",
            fontWeight: 900,
            color: "white",
            lineHeight: 1.3,
            wordBreak: "keep-all",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {frontmatter.title}
        </div>
        {frontmatter.summary && (
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "rgba(255, 255, 255, 0.75)",
              lineHeight: 1.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {frontmatter.summary}
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "24px",
            color: "rgba(255, 255, 255, 0.7)",
            fontWeight: 700,
          }}
        >
          <span style={{ fontWeight: 900, color: "white" }}>blog</span>
          <span>.jihyo.kim</span>
        </div>
        {frontmatter.tags && (
          <div
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            {frontmatter.tags.slice(0, 3).map((tag: string) => (
              <div
                key={tag}
                style={{
                  fontSize: "18px",
                  color: "rgba(255, 255, 255, 0.85)",
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  padding: "6px 16px",
                  borderRadius: "999px",
                  fontWeight: 700,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Pretendard",
          data: pretendardBold,
          style: "normal",
          weight: 700,
        },
        {
          name: "Pretendard",
          data: pretendardBlack,
          style: "normal",
          weight: 900,
        },
      ],
    },
  );
}
