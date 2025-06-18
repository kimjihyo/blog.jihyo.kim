"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { TOCEntry, getAllIds, useActiveItem, TOCTree } from "./toc-core";
import { cn } from "@/lib/utils";

interface MobileTableOfContentsProps {
  tocEntries: TOCEntry[];
}

export function MobileTableOfContents({
  tocEntries,
}: MobileTableOfContentsProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const itemIds = React.useMemo(() => getAllIds(tocEntries), [tocEntries]);
  const activeHeading = useActiveItem(itemIds);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, type: "tween" }}
            className="fixed inset-0 size-full bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center overflow-y-auto"
            onClick={() => setIsOpen(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <TOCTree
                tree={tocEntries}
                activeItem={activeHeading}
                renderLink={(node, isActive) => (
                  <TocLink
                    node={node}
                    isActive={isActive}
                    onClick={() => setIsOpen(false)}
                  />
                )}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Button
        className="fixed bottom-4 right-4 sm:hidden z-40"
        onClick={() => setIsOpen(!isOpen)}
      >
        목차
      </Button>
    </>
  );
}

interface TocLinkProps {
  node: TOCEntry;
  isActive: boolean;
  onClick: () => void;
}

function TocLink({ node, isActive, onClick }: TocLinkProps) {
  return (
    <motion.a
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: node.index * 0.05,
      }}
      style={{ originY: 0 }}
      href={`#${node.id}`}
      className={cn(
        "inline-block no-underline transition-colors hover:text-foreground text-sm",
        isActive ? "font-semibold text-foreground" : "text-muted-foreground"
      )}
      onClick={onClick}
    >
      {node.title}
    </motion.a>
  );
}
