"use client";

import * as React from "react";
import {
  TOCEntry,
  getAllIds,
  useActiveItem,
  TOCTree,
  markOrder,
} from "./toc-core";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface TableOfContentsProps {
  tocEntries: TOCEntry[];
}

export function TableOfContents({ tocEntries }: TableOfContentsProps) {
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
    <div className="sticky top-24 hidden h-fit border-l pl-6 lg:block">
      <p className="font-medium leading-8">목차</p>
      <div
        ref={tocCursorElementRef}
        className="bg-primary absolute -left-px top-0 hidden h-6 w-0.5 transition-transform ease-in-out"
      />
      <TOCTree
        tree={tocEntriesWithOrder}
        activeItem={activeHeading}
        renderLink={(node, isActive) => (
          <React.Fragment key={node.id}>
            <motion.a
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: node.order * 0.05,
              }}
              href={`#${node.id}`}
              className={cn(
                "text-muted-foreground hover:text-foreground inline-block text-sm no-underline transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {node.value}
            </motion.a>
          </React.Fragment>
        )}
      />
    </div>
  );
}
