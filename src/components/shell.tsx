import { cn } from "@/lib/utils";
import * as React from "react";

export function Shell({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-5xl px-6 py-8 sm:px-8", className)}
      {...props}
    />
  );
}
