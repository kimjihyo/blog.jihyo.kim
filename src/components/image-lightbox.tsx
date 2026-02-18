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

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) {
        close();
      }
    },
    [close],
  );

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
            onClick={handleBackdropClick}
            onClose={close}
            className="bg-background/0 fixed inset-0 m-0 flex h-dvh max-h-dvh w-dvw max-w-full items-center justify-center p-4 backdrop:bg-black/80 backdrop:backdrop-blur-sm"
          >
            <div className="relative h-[90vh] w-[90vw]">
              <button
                type="button"
                onClick={close}
                aria-label="닫기"
                className="bg-background/80 text-foreground absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-lg shadow-md backdrop-blur-sm"
              >
                ✕
              </button>
              <Image
                {...props}
                alt={alt}
                fill
                sizes="90vw"
                className="rounded-lg object-contain"
              />
            </div>
          </dialog>,
          document.body,
        )}
    </>
  );
}
