"use client";

import * as React from "react";
import NextImage, { ImageProps as NextImageProps } from "next/image";
import { cn } from "@/lib/utils";

export function Image({ className, ...props }: NextImageProps) {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <NextImage
      className={cn(
        "transition-opacity duration-300",
        isLoading ? "opacity-0" : "opacity-100",
        className
      )}
      onLoad={() => setIsLoading(false)}
      {...props}
    />
  );
}
