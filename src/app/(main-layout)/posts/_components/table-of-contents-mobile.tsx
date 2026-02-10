"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  TOCEntry,
  getAllIds,
  useActiveItem,
  TOCTree,
  markOrder,
} from "./table-of-contents-core";
import { cn } from "@/lib/utils";

interface MobileTableOfContentsProps {
  tocEntries: TOCEntry[];
}

export function TableOfContentsMobile({
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
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex size-full animate-fade-in flex-col items-center justify-center overflow-y-auto bg-background/80 backdrop-blur-sm"
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
        </div>
      )}
      <Button
        className="fixed right-4 bottom-4 z-40 sm:hidden"
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
    <a
      href={`#${node.id}`}
      className={cn(
        "inline-block text-sm no-underline transition-colors hover:text-foreground",
        isActive ? "font-semibold text-foreground" : "text-muted-foreground",
      )}
      onClick={onClick}
    >
      {node.value}
    </a>
  );
}
