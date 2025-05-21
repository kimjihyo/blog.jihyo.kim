import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PostCard } from "./post-card";
import type { Post } from "content-collections";

// Mock the Image component
vi.mock("./ui/image", () => ({
  Image: vi.fn((props) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img data-testid="mock-image" alt={props.alt} src={props.src} />
  )),
}));

// Mock the Badge component
vi.mock("./ui/badge", () => ({
  Badge: vi.fn(({ children }) => (
    <span data-testid="mock-badge">{children}</span>
  )),
}));

const mockPost: Post = {
  _meta: {
    filePath: "/content/posts/test-post.md",
    fileName: "test-post.md",
    directory: "posts",
    path: "test-post",
    extension: ".md",
  },
  title: "Test Post Title",
  summary: "Test post summary",
  tags: ["react", "testing"],
  thumbnail: "/test-image.jpg",
  createdTime: new Date("2024-03-15"),
  updatedTime: new Date("2024-03-15"),
  html: "",
  toc: [],
  type: "dev-log",
  content: "",
};

describe("PostCard Component", () => {
  it("renders post title and summary", () => {
    render(<PostCard post={mockPost} />);

    expect(screen.getByText("Test Post Title")).toBeInTheDocument();
    expect(screen.getByText("Test post summary")).toBeInTheDocument();
  });

  it("renders all tags", () => {
    render(<PostCard post={mockPost} />);

    const badges = screen.getAllByTestId("mock-badge");
    expect(badges).toHaveLength(2);
    expect(badges[0]).toHaveTextContent("react");
    expect(badges[1]).toHaveTextContent("testing");
  });

  it("renders thumbnail image when provided", () => {
    render(<PostCard post={mockPost} />);

    const image = screen.getByTestId("mock-image");
    expect(image).toHaveAttribute("src", "/test-image.jpg");
  });

  it("renders correct date format", () => {
    render(<PostCard post={mockPost} />);

    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("Mar")).toBeInTheDocument();
  });

  it("links to the correct post URL", () => {
    render(<PostCard post={mockPost} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/posts/test-post");
  });
});
