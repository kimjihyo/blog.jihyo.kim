"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { allPosts } from "content-collections";

type TOCEntry = NonNullable<(typeof allPosts)[0]["toc"]>[0];

const getAllIds = (entries: TOCEntry[]): string[] => {
  return entries.flatMap((entry) => [
    entry.id,
    ...(entry.children ? getAllIds(entry.children) : []),
  ]);
};

interface TableOfContentsProps {
  tocEntries: TOCEntry[];
}

export function TableOfContents({ tocEntries }: TableOfContentsProps) {
  const itemIds = React.useMemo<string[]>(
    () => getAllIds(tocEntries),
    [tocEntries]
  );

  const activeHeading = useActiveItem(itemIds);

  if (!tocEntries?.length) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="font-medium">목차</p>
      <Tree tree={tocEntries} activeItem={activeHeading} />
    </div>
  );
}

interface TreeProps {
  tree: TOCEntry[];
  level?: number;
  activeItem?: string;
}

function Tree({ tree, level = 1, activeItem }: TreeProps) {
  return (
    <ul className={cn("m-0 list-none", { "pl-4": level !== 1 })}>
      {tree.map((node: TOCEntry) => (
        <li key={node.id} className="mt-0">
          <a
            href={`#${node.id}`}
            className={cn(
              "inline-block no-underline transition-all hover:text-foreground text-muted-foreground text-sm",
              node.id === activeItem
                ? "font-medium text-foreground scale-105"
                : "text-muted-foreground"
            )}
          >
            {node.title}
          </a>
          {node.children && node.children.length > 0 && (
            <Tree
              tree={node.children}
              level={level + 1}
              activeItem={activeItem}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = React.useState<string>();

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: `0% 0% -80% 0%` }
    );

    itemIds?.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      itemIds?.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [itemIds]);

  return activeId;
}
