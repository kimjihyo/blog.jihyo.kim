import { cn } from "@/lib/utils";
import * as React from "react";

export function Shell({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("w-full max-w-5xl py-8 px-6 mx-auto sm:px-8", className)}
      {...props}
    />
  );
}
