import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { Shell } from "../shell";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full h-16 border-b bg-background/80 backdrop-blur-sm">
      <Shell className="py-0 h-full flex items-center gap-6">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "flex items-center space-x-2"
          )}
        >
          <Image src="/profile.png" alt="" width={32} height={32} />
          {/* <span className="font-bold">{siteConfig.name}</span> */}
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* <Button size="sm" asChild>
            <Link href="/subscribe">구독하기</Link>
          </Button> */}
          <ModeToggle />
        </div>
      </Shell>
    </header>
  );
}
