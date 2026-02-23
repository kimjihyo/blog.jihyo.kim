import Link from "next/link";
import { siteConfig } from "@/config/site";
import { buttonVariants } from "../ui/button";
import { Icons } from "../icons";
import { Shell } from "../shell";
import { ModeSwitch } from "./mode-switch";

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-border">
      <Shell className="flex max-w-7xl flex-col gap-2">
        <section className="flex flex-col gap-10 lg:flex-row lg:gap-20">
          <section>
            <Link href="/" aria-label="Home">
              김지효
            </Link>
          </section>
        </section>
        <section>
          <span className="text-sm text-muted-foreground">
            With design inspiration from toss.tech
          </span>
        </section>
        <section className="flex items-center space-x-4">
          <div className="flex-1 text-left text-sm leading-loose text-muted-foreground">
            Built by{" "}
            <Link
              aria-label="Home"
              href="/"
              className="font-medium transition-colors hover:text-foreground"
            >
              Jihyo Kim{" "}
            </Link>
          </div>
          <div className="flex items-center space-x-1">
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "ghost", size: "icon" })}
              aria-label="GitHub"
            >
              <Icons.github
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
            </a>
            <a
              href="/rss.xml"
              className={buttonVariants({ variant: "ghost", size: "icon" })}
              aria-label="RSS 피드"
            >
              <Icons.rss
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
            </a>
            <ModeSwitch />
          </div>
        </section>
      </Shell>
    </footer>
  );
}
