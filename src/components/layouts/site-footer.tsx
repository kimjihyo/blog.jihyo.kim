import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { ModeToggle } from "./mode-toggle";

export function SiteFooter() {
  return (
    <footer className="w-full border-t">
      <div className="w-full max-w-4xl mx-auto px-8 pb-8 pt-6 lg:py-6 flex flex-col gap-2">
        <section className="flex flex-col gap-10 lg:flex-row lg:gap-20">
          <section>
            <Link href="/" className="flex w-fit items-center space-x-2">
              <span className="font-knewave">{siteConfig.name}</span>
            </Link>
          </section>
        </section>
        <section className="flex items-center space-x-4">
          <div className="flex-1 text-left text-sm leading-loose text-muted-foreground">
            Built by{" "}
            <Link
              href="/"
              className="font-semibold transition-colors hover:text-foreground"
            >
              Jihyo Kim
            </Link>
            .
          </div>
          <div className="flex items-center space-x-1">
            <Button asChild size="icon" variant="ghost">
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
              >
                <Icons.github
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <ModeToggle />
          </div>
        </section>
      </div>
    </footer>
  );
}
