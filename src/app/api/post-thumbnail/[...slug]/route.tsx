import { ImageResponse } from "next/og";
import { allPosts } from "content-collections";

export const runtime = "edge";
export const contentType = "image/png";

const CONTENT_ASPECT_RATIO = 130 / 90;
const CONTENT_HEIGHT = 630;
const CONTENT_WIDTH = CONTENT_HEIGHT * CONTENT_ASPECT_RATIO;

const BACKGROUND_ASPECT_RATIO = 1200 / 630;
const BACKGROUND_HEIGHT = 630;
const BACKGROUND_WIDTH = BACKGROUND_HEIGHT * BACKGROUND_ASPECT_RATIO;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const slug = (await params).slug.join("/");
  const post = allPosts.find((post) => post._meta.path === slug);

  if (!post) {
    return new Response("Post not found", { status: 404 });
  }

  try {
    const pretendardBold = await fetch(
      new URL("../../../../assets/fonts/Pretendard-Bold.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "blue",
            background: "#4e54c8",
            backgroundImage: "linear-gradient(to right, #8f94fb, #4e54c8)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: `${CONTENT_WIDTH}px`,
              height: `${CONTENT_HEIGHT}px`,
              padding: "0px 120px",
            }}
          >
            <span
              style={{
                fontSize: "85px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              {post.title}
            </span>
          </div>
        </div>
      ),
      {
        width: BACKGROUND_WIDTH,
        height: BACKGROUND_HEIGHT,
        fonts: [
          {
            name: "Pretendard",
            data: pretendardBold,
            style: "normal",
            weight: 700,
          },
        ],
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(`Failed to generate image: ${message}`, {
      status: 500,
    });
  }
}
