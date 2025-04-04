import { siteConfig } from "@/config/site";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { Shell } from "../shell";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full h-16 border-b bg-background">
      <Shell className="py-0 h-full flex items-center gap-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-extrabold">{siteConfig.name}</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="primary" size="sm" asChild>
            <Link href={siteConfig.links.github}>GitHub</Link>
          </Button>
          <ModeToggle variant="default" />
        </div>
      </Shell>
    </header>
  );
}
