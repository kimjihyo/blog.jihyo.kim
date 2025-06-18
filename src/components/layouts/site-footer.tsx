import Link from "next/link";
import { siteConfig } from "@/config/site";
import { buttonVariants } from "../ui/button";
import { Icons } from "../icons";
import { ModeToggle } from "./mode-toggle";
import { Shell } from "../shell";

export function SiteFooter() {
  return (
    <footer className="w-full border-t">
      <Shell className="flex flex-col gap-2">
        <section className="flex flex-col gap-10 lg:flex-row lg:gap-20">
          <section>
            <Link href="/" className="flex w-fit items-center space-x-2">
              <span className="font-extrabold">{siteConfig.name}</span>
            </Link>
          </section>
        </section>
        <section>
          <span className="text-muted-foreground text-sm">
            With design inspiration from toss.tech
          </span>
        </section>
        <section className="flex items-center space-x-4">
          <div className="flex-1 text-left text-sm leading-loose text-muted-foreground">
            Built by{" "}
            <Link
              href="/"
              className="font-semibold transition-colors hover:text-foreground"
            >
              Jihyo Kim{" "}
            </Link>
          </div>
          <div className="flex items-center space-x-1">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "ghost", size: "icon" })}
            >
              <Icons.github
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
            </Link>
            <ModeToggle />
          </div>
        </section>
      </Shell>
    </footer>
  );
}
