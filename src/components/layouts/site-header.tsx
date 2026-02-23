import Link from "next/link";
import { Shell } from "../shell";
import { ModeSwitch } from "./mode-switch";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 h-16 w-full bg-background/70 backdrop-blur-md">
      <Shell className="flex h-full max-w-7xl items-center gap-6 py-0 sm:py-0">
        <Link href="/" aria-label="Home">
          김지효
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ModeSwitch />
        </div>
      </Shell>
    </header>
  );
}
