import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Tags } from "./tags";

// Mock the allTags import
vi.mock("@/lib/allTags", () => ({
  allTags: ["react", "typescript", "nextjs"],
}));

// Mock the badge variants
vi.mock("./ui/badge", () => ({
  badgeVariants: ({ variant }: { variant?: string }) =>
    variant === "primary" ? "primary-badge" : "default-badge",
}));

describe("Tags Component", () => {
  it("renders all tags", () => {
    render(<Tags />);
    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("typescript")).toBeInTheDocument();
    expect(screen.getByText("nextjs")).toBeInTheDocument();
  });

  it("applies correct variant class based on selection", () => {
    render(<Tags selected="react" />);

    const selectedTag = screen.getByText("react").closest("a");
    const unselectedTag = screen.getByText("typescript").closest("a");

    expect(selectedTag).toHaveClass("primary-badge");
    expect(unselectedTag).toHaveClass("default-badge");
  });

  it("renders correct links for tags", () => {
    render(<Tags />);

    const tags = ["react", "typescript", "nextjs"];
    tags.forEach((tag) => {
      const link = screen.getByText(tag).closest("a");
      expect(link).toHaveAttribute("href", `/posts/tags/${tag}`);
    });
  });
});
