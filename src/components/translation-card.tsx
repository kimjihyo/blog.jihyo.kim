import type { Translation } from "content-collections";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { formatDate } from "@/lib/utils";

interface TranslationCardProps {
  translation: Translation;
}

export function TranslationCard({ translation }: TranslationCardProps) {
  return (
    <article>
      <Link
        href={`/translations/${translation._meta.path}`}
        className="group flex flex-col gap-1"
      >
        <h2 className="text-2xl font-semibold text-foreground/80 transition-colors group-hover:text-foreground">
          {translation.title}
        </h2>
        <p className="text-muted-foreground">{translation.summary}</p>
        <ul className="flex flex-wrap gap-1">
          {translation.tags.map((tag) => (
            <li key={tag}>
              <Badge>{tag}</Badge>
            </li>
          ))}
        </ul>
        <time
          className="block line-clamp-1 text-sm text-muted-foreground"
          dateTime={translation.date}
        >
          {formatDate(translation.date)}
        </time>
      </Link>
    </article>
  );
}
