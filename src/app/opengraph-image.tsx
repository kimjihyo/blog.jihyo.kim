import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Image metadata
export const alt = "Jihyo Kim";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  // Font loading, process.cwd() is Next.js project directory
  const pretendardSemibold = await readFile(
    join(process.cwd(), "src/assets/fonts/Pretendard-SemiBold.ttf")
  );

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(180deg,rgba(0, 0, 0, 1) 0%, rgba(59, 59, 59, 1) 50%, rgba(0, 0, 0, 1) 100%)',
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          color: "white",
        }}
      >
        blog.jihyo.kim
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: "Pretendard",
          data: pretendardSemibold,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
