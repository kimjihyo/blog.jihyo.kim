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
  const itemIds = React.useMemo<string[]>(
    () => getAllIds(tocEntries),
    [tocEntries]
  );
  const activeHeading = useActiveItem(itemIds);

  const tocEntriesWithOrder = React.useMemo(
    () => markOrder(tocEntries),
    [tocEntries]
  );

  if (!tocEntries?.length) {
    return null;
  }

  return (
    <div className="hidden sticky top-24 h-fit md:block border-l pl-6">
      <p className="font-medium">목차</p>
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
                "inline-block no-underline transition-colors hover:text-foreground text-muted-foreground text-sm",
                isActive
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {node.value}
            </motion.a>
            {isActive && (
              <motion.div
                layout
                layoutId="toc-line"
                className="bg-primary h-5 w-0.5 absolute -left-px -translate-y-full"
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                }}
              />
            )}
          </React.Fragment>
        )}
      />
    </div>
  );
}
