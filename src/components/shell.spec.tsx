import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Shell } from "./shell";

describe("Shell Component", () => {
  it("renders with default classes", () => {
    render(<Shell>Test content</Shell>);
    const shell = screen.getByText("Test content");
    expect(shell).toHaveClass(
      "w-full",
      "max-w-5xl",
      "py-8",
      "px-4",
      "mx-auto",
      "sm:px-8"
    );
  });

  it("merges custom className with default classes", () => {
    render(<Shell className="custom-class">Test content</Shell>);
    const shell = screen.getByText("Test content");
    expect(shell).toHaveClass("custom-class");
    expect(shell).toHaveClass("w-full", "max-w-5xl");
  });

  it("passes through additional props", () => {
    render(<Shell data-testid="shell-div">Test content</Shell>);
    const shell = screen.getByTestId("shell-div");
    expect(shell).toBeInTheDocument();
  });
});
