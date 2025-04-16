"use client";
import * as React from "react";
import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

export default function Comments() {
  const [mounted, setMounted] = React.useState<boolean>(false);
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Giscus
      id="comments"
      repo="kimjihyo/blog.jihyo.kim"
      repoId="R_kgDOONQWww"
      category="Announcements"
      categoryId="DIC_kwDOONQWw84Co67m"
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={resolvedTheme === "light" ? "light" : "noborder_dark"}
      lang="ko"
      loading="lazy"
    />
  );
}
