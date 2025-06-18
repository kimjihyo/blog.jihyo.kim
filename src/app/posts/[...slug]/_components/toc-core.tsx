import * as React from "react";

export type TOCEntry = {
  id: string;
  title: string;
  index: number;
  children?: TOCEntry[];
};

export const getAllIds = (entries?: TOCEntry[]): string[] => {
  if (!Array.isArray(entries)) return [];
  return entries.flatMap((entry) => [
    entry.id,
    ...(entry.children ? getAllIds(entry.children) : []),
  ]);
};

export function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = React.useState<string>(itemIds[0]);
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: `0% 0% -80% 0%` }
    );
    itemIds?.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => {
      itemIds?.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, [itemIds]);
  return activeId;
}

export function TOCTree({
  tree,
  level = 1,
  activeItem,
  renderLink,
}: {
  tree: TOCEntry[];
  level?: number;
  activeItem?: string;
  renderLink?: (node: TOCEntry, isActive: boolean) => React.ReactNode;
}) {
  return (
    <ul className={level !== 1 ? "pl-4" : ""}>
      {tree.map((node, index) => (
        <li key={node.id}>
          {renderLink ? (
            renderLink(node, node.id === activeItem)
          ) : (
            <a
              href={`#${node.id}`}
              className={node.id === activeItem ? "font-semibold" : ""}
            >
              {node.title}
            </a>
          )}
          {node.children && node.children.length > 0 && (
            <TOCTree
              tree={node.children}
              level={level + 1}
              activeItem={activeItem}
              renderLink={renderLink}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
