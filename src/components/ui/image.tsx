"use client";

import * as React from "react";
import NextImage, { ImageProps as NextImageProps } from "next/image";
import { cn } from "@/lib/utils";

export function Image({ className, ...props }: NextImageProps) {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <NextImage
      className={cn(
        "transition-opacity duration-500 opacity-0",
        isLoading ? "" : "opacity-100",
        className
      )}
      onLoad={() => {
        setIsLoading(false);
      }}
      {...props}
    />
  );
}
