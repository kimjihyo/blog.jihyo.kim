"use client";

import Image, { type ImageProps } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ImageLightboxProps = Omit<ImageProps, "width" | "height"> & {
  width?: number;
  height?: number;
};

export function ImageLightbox({
  alt = "",
  width = 800,
  height = 600,
  className,
  ...props
}: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    }
  }, [isOpen]);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
    setIsOpen(false);
  }, []);

  return (
    <>
      <Image
        width={width}
        height={height}
        sizes="100vw"
        className={`my-3 h-auto w-full cursor-zoom-in rounded-md ${className ?? ""}`}
        alt={alt}
        onClick={open}
        {...props}
      />
      {isOpen &&
        createPortal(
          <dialog
            ref={dialogRef}
            onClose={close}
            className="fixed inset-0 m-0 flex h-dvh max-h-dvh w-dvw max-w-full items-center justify-center bg-background/0 backdrop:bg-black/80 backdrop:backdrop-blur-sm"
          >
            <div className="absolute inset-0" onClick={close} />
            <div
              className="pointer-events-none relative z-10 h-[90vh] w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={close}
                aria-label="닫기"
                className="pointer-events-auto absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-lg text-foreground shadow-md backdrop-blur-sm"
              >
                ✕
              </button>
              <Image
                {...props}
                alt={alt}
                fill
                sizes="90vw"
                className="pointer-events-auto rounded-lg object-contain"
              />
            </div>
          </dialog>,
          document.body,
        )}
    </>
  );
}
