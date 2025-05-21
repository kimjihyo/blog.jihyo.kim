import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProfileCard } from "./profile-card";

// Mock the UI components
vi.mock("./ui/card", () => ({
  Card: vi.fn(({ children }) => <div data-testid="mock-card">{children}</div>),
  CardContent: vi.fn(({ children, className }) => (
    <div data-testid="mock-card-content" className={className}>
      {children}
    </div>
  )),
  CardTitle: vi.fn(({ children, className }) => (
    <div data-testid="mock-card-title" className={className}>
      {children}
    </div>
  )),
}));

vi.mock("./ui/avatar", () => ({
  Avatar: vi.fn(({ children, className }) => (
    <div data-testid="mock-avatar" className={className}>
      {children}
    </div>
  )),
  AvatarImage: vi.fn(({ src }) => (
    <img data-testid="mock-avatar-image" src={src} alt="" />
  )),
  AvatarFallback: vi.fn(({ children }) => (
    <div data-testid="mock-avatar-fallback">{children}</div>
  )),
}));

// Mock the site config
vi.mock("@/config/site", () => ({
  siteConfig: {
    avatarImage: "/test-avatar.jpg",
  },
}));

describe("ProfileCard Component", () => {
  it("renders the profile card with correct structure", () => {
    render(<ProfileCard />);

    expect(screen.getByTestId("mock-card")).toBeInTheDocument();
    expect(screen.getByTestId("mock-card-content")).toBeInTheDocument();
    expect(screen.getByTestId("mock-card-title")).toBeInTheDocument();
  });

  it("renders avatar images with correct source", () => {
    render(<ProfileCard />);

    const avatarImages = screen.getAllByTestId("mock-avatar-image");
    avatarImages.forEach((image) => {
      expect(image).toHaveAttribute("src", "/test-avatar.jpg");
    });
  });

  it("renders avatar fallback with correct text", () => {
    render(<ProfileCard />);

    const fallbacks = screen.getAllByTestId("mock-avatar-fallback");
    fallbacks.forEach((fallback) => {
      expect(fallback).toHaveTextContent("JK");
    });
  });

  it("renders the name", () => {
    render(<ProfileCard />);

    expect(screen.getByText("김지효")).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<ProfileCard />);

    expect(screen.getByText(/작은 것 하나하나/)).toBeInTheDocument();
  });

  it("applies correct responsive classes to avatars", () => {
    render(<ProfileCard />);

    const avatars = screen.getAllByTestId("mock-avatar");
    expect(avatars[0]).toHaveClass("w-16", "h-16", "hidden", "sm:block");
    expect(avatars[1]).toHaveClass("w-8", "h-8", "sm:hidden");
  });
});
