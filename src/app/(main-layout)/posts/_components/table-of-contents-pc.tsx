"use client";

import * as React from "react";
import {
  TOCEntry,
  getAllIds,
  useActiveItem,
  TOCTree,
  markOrder,
} from "./table-of-contents-core";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  tocEntries: TOCEntry[];
}

export function TableOfContentsPc({ tocEntries }: TableOfContentsProps) {
  const tocCursorElementRef = React.useRef<HTMLDivElement | null>(null);

  const itemIds = React.useMemo<string[]>(
    () => getAllIds(tocEntries),
    [tocEntries],
  );
  const activeHeading = useActiveItem(itemIds);

  const tocEntriesWithOrder = React.useMemo(
    () => markOrder(tocEntries),
    [tocEntries],
  );

  React.useLayoutEffect(() => {
    if (!tocCursorElementRef.current) {
      return;
    }
    const element = document.getElementById(`toc-${activeHeading}`);
    const top = element?.offsetTop;
    tocCursorElementRef.current.style.display = "block";
    tocCursorElementRef.current.style.transform = `translateY(${top}px)`;
  }, [activeHeading]);

  if (!tocEntries?.length) {
    return null;
  }

  return (
    <div className="sticky top-24 hidden h-fit border-l border-border pl-6 lg:block">
      <p className="leading-8 font-medium">목차</p>
      <div
        ref={tocCursorElementRef}
        className="absolute top-0 -left-px hidden h-6 w-0.5 bg-primary transition-transform duration-300 ease-in-out-material"
      />
      <TOCTree
        tree={tocEntriesWithOrder}
        activeItem={activeHeading}
        renderLink={(node, isActive) => (
          <a
            key={node.id}
            href={`#${node.id}`}
            className={cn(
              "inline-block text-sm text-muted-foreground no-underline transition-colors hover:text-foreground",
              isActive ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {node.value}
          </a>
        )}
      />
    </div>
  );
}
