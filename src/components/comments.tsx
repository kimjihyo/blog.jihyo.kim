"use client";
import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

export default function Comments() {
  const { theme } = useTheme();

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
      theme={theme}
      lang="ko"
      loading="lazy"
    />
  );
}
