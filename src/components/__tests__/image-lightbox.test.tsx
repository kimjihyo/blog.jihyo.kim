import { fireEvent, render, screen, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ImageLightbox } from "../image-lightbox";

vi.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  default: ({ width, height, sizes, fill, priority, quality, loader, ...rest }: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...(rest as React.ComponentProps<"img">)} />;
  },
}));

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (
    this: HTMLDialogElement,
  ) {
    this.setAttribute("open", "");
  });
  HTMLDialogElement.prototype.close = vi.fn(function (
    this: HTMLDialogElement,
  ) {
    this.removeAttribute("open");
  });
});

describe("ImageLightbox", () => {
  it("이미지가 정상 렌더링된다", () => {
    render(<ImageLightbox src="/test.png" alt="테스트 이미지" />);
    const images = screen.getAllByAltText("테스트 이미지");
    expect(images.length).toBeGreaterThanOrEqual(1);
  });

  it("이미지 클릭 시 dialog가 열린다", () => {
    render(<ImageLightbox src="/test.png" alt="테스트 이미지" />);

    const thumbnail = screen.getAllByAltText("테스트 이미지")[0];
    act(() => {
      fireEvent.click(thumbnail);
    });

    const dialog = document.querySelector("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("open");
  });

  it("닫기 버튼 클릭 시 dialog가 닫힌다", () => {
    render(<ImageLightbox src="/test.png" alt="테스트 이미지" />);

    const thumbnail = screen.getAllByAltText("테스트 이미지")[0];
    act(() => {
      fireEvent.click(thumbnail);
    });

    const closeButton = screen.getByRole("button", { name: "닫기" });
    act(() => {
      fireEvent.click(closeButton);
    });

    expect(document.querySelector("dialog")).not.toBeInTheDocument();
  });

  it("오버레이 배경 클릭 시 dialog가 닫힌다", () => {
    render(<ImageLightbox src="/test.png" alt="테스트 이미지" />);

    const thumbnail = screen.getAllByAltText("테스트 이미지")[0];
    act(() => {
      fireEvent.click(thumbnail);
    });

    const dialog = document.querySelector("dialog")!;
    act(() => {
      fireEvent.click(dialog);
    });

    expect(document.querySelector("dialog")).not.toBeInTheDocument();
  });

  it("alt 텍스트가 라이트박스 이미지에도 전달된다", () => {
    render(<ImageLightbox src="/test.png" alt="설명 텍스트" />);

    const thumbnail = screen.getAllByAltText("설명 텍스트")[0];
    act(() => {
      fireEvent.click(thumbnail);
    });

    const images = screen.getAllByAltText("설명 텍스트");
    expect(images.length).toBe(2);
  });
});
