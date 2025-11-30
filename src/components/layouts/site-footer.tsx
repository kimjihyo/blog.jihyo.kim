import Link from "next/link";
import { siteConfig } from "@/config/site";
import { buttonVariants } from "../ui/button";
import { Icons } from "../icons";
import { Shell } from "../shell";
import Image from "next/image";
import { ModeSwitch } from "./mode-switch";

export function SiteFooter() {
  return (
    <footer className="w-full border-t">
      <Shell className="flex max-w-6xl flex-col gap-2">
        <section className="flex flex-col gap-10 lg:flex-row lg:gap-20">
          <section>
            <Link
              href="/"
              aria-label="Home"
              className="flex w-fit items-center space-x-2"
            >
              <Image src="/profile.png" alt="" width={32} height={32} />
            </Link>
          </section>
        </section>
        <section>
          <span className="text-muted-foreground text-sm">
            With design inspiration from toss.tech
          </span>
        </section>
        <section className="flex items-center space-x-4">
          <div className="text-muted-foreground flex-1 text-left text-sm leading-loose">
            Built by{" "}
            <Link
              aria-label="Home"
              href="/"
              className="hover:text-foreground font-semibold transition-colors"
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
                className="text-muted-foreground size-4"
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
