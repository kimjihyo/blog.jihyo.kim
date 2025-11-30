import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

import { Shell } from "../shell";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ModeSwitch } from "./mode-switch";
// import { LanguageSelect } from "./language-select";

export function SiteHeader() {
  return (
    <header className="bg-background sticky top-0 z-50 h-16 w-full border-b">
      <Shell className="flex h-full max-w-6xl items-center gap-6 py-0">
        <Link
          href="/"
          aria-label="Home"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "flex items-center space-x-2",
          )}
        >
          <Image src="/profile.png" alt="" width={32} height={32} />
          {/* <span className="font-semibold">{siteConfig.name}</span> */}
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* <Button size="sm" asChild>
            <Link href="/subscribe">구독하기</Link>
          </Button> */}
          {/* <LanguageSelect /> */}
          <ModeSwitch />
        </div>
      </Shell>
    </header>
  );
}
