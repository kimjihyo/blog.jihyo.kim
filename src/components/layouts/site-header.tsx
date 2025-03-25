import { siteConfig } from "@/config/site";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="w-full max-w-4xl px-8 mx-auto flex h-16 items-center gap-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-knewave">{siteConfig.name}</span>
        </Link>
        <div className="flex flex-1 items-center space-x-2">
          <Button size="sm" variant="ghost" asChild>
            <Link href="/posts">작성글</Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href="/translations">번역글</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
