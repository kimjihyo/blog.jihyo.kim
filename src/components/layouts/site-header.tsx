import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

import { Shell } from "../shell";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ModeSwitch } from "./mode-switch";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 h-16 w-full bg-background/70 backdrop-blur-md">
      <Shell className="flex h-full max-w-7xl items-center gap-6 py-0 sm:py-0">
        <Link
          href="/"
          aria-label="Home"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "flex items-center space-x-2",
          )}
        >
          <Image
            src="/profile.png"
            alt=""
            width={32}
            height={32}
            className="rounded-full"
          />
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ModeSwitch />
        </div>
      </Shell>
    </header>
  );
}
