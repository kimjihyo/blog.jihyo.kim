import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "김지효의 기록 보관소 — 개발 경험과 기술적 회고를 기록하는 블로그";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const pretendardSemiBold = await readFile(
    join(process.cwd(), "src/assets/fonts/Pretendard-semibold.ttf"),
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
          gap: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "56px",
            fontWeight: 900,
            color: "white",
            lineHeight: 1.3,
          }}
        >
          김지효의 기록 보관소
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "26px",
            fontWeight: 700,
            color: "rgba(255, 255, 255, 0.75)",
            lineHeight: 1.6,
          }}
        >
          개발 경험과 기술적 회고를 기록하고 공유합니다
        </div>
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
        <div
          style={{
            display: "flex",
            fontSize: "20px",
            fontWeight: 700,
            color: "white",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            padding: "10px 28px",
            borderRadius: "999px",
          }}
        >
          블로그 방문하기 →
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Pretendard",
          data: pretendardSemiBold,
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
