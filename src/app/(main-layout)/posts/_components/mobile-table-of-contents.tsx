"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import {
  TOCEntry,
  getAllIds,
  useActiveItem,
  TOCTree,
  markOrder,
} from "./toc-core";
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
  const tocEntriesWithOrder = React.useMemo(
    () => markOrder(tocEntries),
    [tocEntries],
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, type: "tween" }}
            className="bg-background/80 fixed inset-0 z-50 flex size-full flex-col items-center justify-center overflow-y-auto backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <TOCTree
                tree={tocEntriesWithOrder}
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
        className="fixed bottom-4 right-4 z-40 sm:hidden"
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
        delay: node.order * 0.05,
      }}
      style={{ originY: 0 }}
      href={`#${node.id}`}
      className={cn(
        "hover:text-foreground inline-block text-sm no-underline transition-colors",
        isActive ? "text-foreground font-semibold" : "text-muted-foreground",
      )}
      onClick={onClick}
    >
      {node.value}
    </motion.a>
  );
}
