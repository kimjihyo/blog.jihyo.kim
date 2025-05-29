import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const CONTENT_ASPECT_RATIO = 130 / 90;
const CONTENT_HEIGHT = 630;
const CONTENT_WIDTH = CONTENT_HEIGHT * CONTENT_ASPECT_RATIO;

const BACKGROUND_ASPECT_RATIO = 1200 / 630;
const BACKGROUND_HEIGHT = 630;
const BACKGROUND_WIDTH = BACKGROUND_HEIGHT * BACKGROUND_ASPECT_RATIO;

// Image metadata
export const alt = "Jihyo Kim";
export const size = {
  width: BACKGROUND_WIDTH,
  height: BACKGROUND_HEIGHT,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  // Font loading, process.cwd() is Next.js project directory
  const pretendardBold = await readFile(
    join(process.cwd(), "src/assets/fonts/Pretendard-Bold.ttf")
  );

  const pretendardBlack = await readFile(
    join(process.cwd(), "src/assets/fonts/Pretendard-Black.ttf")
  );

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          backgroundImage: "linear-gradient(to right, #60a5fa, #1d4ed8)",
          fontFamily: "Pretendard",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: `${CONTENT_WIDTH}px`,
            height: `${CONTENT_HEIGHT}px`,
            padding: "0px 120px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "85px",
              color: "white",
            }}
          >
            <span style={{ fontWeight: 900 }}>blog</span>
            <span style={{ fontWeight: 700, opacity: 0.6 }}>.jihyo.kim</span>
          </div>
        </div>
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
    }
  );
}
