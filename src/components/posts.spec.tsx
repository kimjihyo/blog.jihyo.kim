import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Posts } from "./posts";
import type { Post } from "content-collections";

// Mock the PostCard component
vi.mock("./post-card", () => ({
  PostCard: vi.fn(({ post }) => (
    <div data-testid="mock-post-card" data-path={post._meta.path}>
      {post.title}
    </div>
  )),
}));

// Mock the allPostsSortedByDate import
vi.mock("@/lib/allPostsSortedByDate", () => ({
  allPostsSortedByDate: [
    {
      _meta: {
        filePath: "/content/posts/dev-post.md",
        fileName: "dev-post.md",
        directory: "posts",
        path: "dev-post",
        extension: ".md",
      },
      title: "Dev Post",
      summary: "A dev post",
      tags: ["react", "typescript"],
      type: "dev-log",
      thumbnail: "/dev-post-thumb.jpg",
      createdTime: new Date("2024-03-15"),
      updatedTime: new Date("2024-03-15"),
      html: "",
      toc: [],
      content: "",
    },
    {
      _meta: {
        filePath: "/content/posts/daily-post.md",
        fileName: "daily-post.md",
        directory: "posts",
        path: "daily-post",
        extension: ".md",
      },
      title: "Daily Post",
      summary: "A daily post",
      tags: ["life"],
      type: "daily",
      thumbnail: "/daily-post-thumb.jpg",
      createdTime: new Date("2024-03-14"),
      updatedTime: new Date("2024-03-14"),
      html: "",
      toc: [],
      content: "",
    },
  ],
}));

describe("Posts Component", () => {
  it("renders all posts when no filters are applied", () => {
    render(<Posts />);

    const postCards = screen.getAllByTestId("mock-post-card");
    expect(postCards).toHaveLength(2);
    expect(postCards[0]).toHaveTextContent("Dev Post");
    expect(postCards[1]).toHaveTextContent("Daily Post");
  });

  it("filters posts by type", () => {
    render(<Posts type="dev-log" />);

    const postCards = screen.getAllByTestId("mock-post-card");
    expect(postCards).toHaveLength(1);
    expect(postCards[0]).toHaveTextContent("Dev Post");
  });

  it("filters posts by tag", () => {
    render(<Posts tag="react" />);

    const postCards = screen.getAllByTestId("mock-post-card");
    expect(postCards).toHaveLength(1);
    expect(postCards[0]).toHaveTextContent("Dev Post");
  });

  it("applies both type and tag filters", () => {
    render(<Posts type="dev-log" tag="typescript" />);

    const postCards = screen.getAllByTestId("mock-post-card");
    expect(postCards).toHaveLength(1);
    expect(postCards[0]).toHaveTextContent("Dev Post");
  });

  it("returns no posts when filters don't match", () => {
    render(<Posts type="daily" tag="react" />);

    const postCards = screen.queryAllByTestId("mock-post-card");
    expect(postCards).toHaveLength(0);
  });
});
