import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const SIZE = 192;

export async function GET() {
  const pretendardBlack = await readFile(
    join(process.cwd(), "src/assets/fonts/Pretendard-Black.ttf"),
  );

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        backgroundImage: "linear-gradient(to bottom right, #60a5fa, #1d4ed8)",
        fontFamily: "Pretendard",
        borderRadius: "32px",
      }}
    >
      <span style={{ fontSize: "100px", fontWeight: 900, color: "white" }}>
        B
      </span>
    </div>,
    {
      width: SIZE,
      height: SIZE,
      fonts: [
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
