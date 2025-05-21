import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Comments from "./comments";

// Mock the Giscus component
vi.mock("@giscus/react", () => ({
  default: vi.fn((props) => (
    <div data-testid="giscus-mock" data-theme={props.theme}>
      Giscus Comments
    </div>
  )),
}));

// Mock next-themes
vi.mock("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: "light",
  }),
}));

describe("Comments Component", () => {
  it("renders Giscus component with correct props", () => {
    render(<Comments />);
    const giscus = screen.getByTestId("giscus-mock");

    expect(giscus).toBeInTheDocument();
    expect(giscus).toHaveAttribute("data-theme", "light");
  });
});
