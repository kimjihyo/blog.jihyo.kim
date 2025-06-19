---
tags: ["Blog", "Web"]
createdTime: "2025-04-22T00:00:00Z"
thumbnail: "https://res.cloudinary.com/dab33vdij/image/upload/v1745330114/IMG_0450_znh85a.png"
summary: "블로그에 자동 목차 생성과 코드 하이라이팅 기능을 어떻게 적용했는지 소개하는 글"
updatedTime: "2025-04-22T00:00:00Z"
type: "dev-log"
title: "블로그 개발 - 목차와 Syntax Highlighting 적용하기"
---

## 시작

이전 글에서 `content-collections`를 이용해 정적 블로그에서 컨텐츠를 관리하는 과정을 소개했습니다. 이번 글에서는 그 연장선으로, 블로그에 자동 목차 생성과 코드 하이라이팅 기능을 어떻게 적용했는지 소개하려고 합니다.

## 목표

Markdown으로 작성한 글을 HTML로 변환하면서 다음 기능을 함께 적용하고자 했습니다.

- 각 `##`, `###` 제목들을 기반으로 목차를 자동 생성하고, 각 제목에 id를 부여해서 앵커 링크로 활용
- 코드 블록에 Syntax highlighting 적용

## 기술 스택

- [unified](https://unifiedjs.com/): Markdown → HTML 변환 파이프라인 구축
- [remark-parse](https://github.com/remarkjs/remark/tree/main/packages/remark-parse): Markdown 을 syntax tree로 파싱 (mdast)
- [remark-rehype](https://github.com/remarkjs/remark-rehype): mdast → HTML AST
- [rehype-stringify](https://github.com/rehypejs/rehype/tree/main/packages/rehype-stringify): HTML AST → HTML 문자열
- [rehype-highlight](https://github.com/rehypejs/rehype-highlight): 코드 블록에 하이라이팅 적용
- [unist-util-visit](https://github.com/syntax-tree/unist-util-visit): AST를 탐색하며 제목 노드를 찾아 TOC 생성

`unified`는 문서 처리 파이프라인의 뼈대를 제공하는 라이브러입니다. 저는 markdown을 html로 변환하는 파이프라인을 구축하기 위해서 사용했습니다. 변환을 하기 위해서는 제가 위에 나열한 `remark-*`, `rehype-*` 플러그인들의 도움을 받았습니다. remark는 unified에서 Markdown을 처리하기 위한 플러그인 집합이고 rehype은 HTML을 다루는 플러그인 집합입니다.

대충 파이프라인의 흐름을 정리해보았습니다.

```
Markdown (.md)
   ↓             ← remark-parse
Markdown AST (MDAST)
   ↓             ← remark-rehype
HTML AST (HAST)
   ↓             ← rehype-stringify
HTML 문자열
```

TypeScript 코드로는 아래와 같습니다.

```tsx title="test" {1-3} showLineNumbers
const html = await unified()
  .use(remarkParse) // 마크다운 → MDAST
  .use(remarkRehype) // MDAST → HAST
  .use(rehypeStringify) // HAST → HTML
  .process(markdown);
```

이런 식으로 각각의 use()가 파이프라인의 한 단계라고 볼 수 있습니다.

## 자동으로 목차를 생성해보자

자동으로 목차를 생성하기 위해서 unified 파이프라인에 목차 생성 단계를 추가했습니다. 아래 코드에서 볼 수 있다시피 `generateTOC` 라는 단계입니다.

```tsx
const html = await unified()
  .use(remarkParse) // 마크다운 → MDAST
  .use(generateTOC) // 자동 목차 생성
  .use(remarkRehype) // MDAST → HAST
  .use(rehypeStringify) // HAST → HTML
  .process(markdown);
```

### 1. Heading 노드 탐색

자동으로 목차를 생성하기 위해서 Markdown에서 `##`, `###` 으로 시작하는 Heading 노드들을 탐색을 해야합니다. 위에서 설명한 파이프라인에서 `remark-parse` 단계를 거치면 mdast 이라는 markdown syntax tree가 만들어지는데, 이를 사용하면 쉽게 노드들을 순회할 수 있습니다.

```tsx
const generateTOC = () => {
  return (mdast: MDastNode) => {
    let index = 0;
    visit(mdast, "heading", (node: MDastNode) => {
      // Extract the title of the current heading
      const title = node.children && node.children[0]?.value;
      ...
    });
    ...
  };
}
```

`visit` 함수는 mdast를 순회하는 `unist-util-visit`라이브러리에서 제공하는 함수입니다. mdast에서 heading 타입 노드를 찾아 그 안에 있는 첫 텍스트 값을 목차의 제목으로 사용하는 코드입니다.

### 2. 고유 id 부여하기

각 제목에는 문서 디렉토리명 + index 형태의 고유 id를 부여했습니다.

```tsx
const id = `${document._meta.directory}-${index++}`;
node.data = node.data || {};
node.data.hProperties = { id };
```

이 id는 HTML로 변환된 후에도 `<h2 id="...">`처럼 유지되어, 앵커 링크로 활용 가능합니다.

### 3. 목차 계층 구조 만들기

스택을 활용해 현재 depth(heading level)를 기준으로 계층 구조를 구성했습니다. depth가 작아질 수록 상위 항목으로 이동하고 깊어질수록 자식 항목으로 분기됩니다.

```tsx
if (stack.length === 0) {
  toc.push(entry); // Top-level
} else {
  const parent = stack[stack.length - 1].entry;
  if (!parent.children) parent.children = [];
  parent.children.push(entry);
}
```

이렇게 완성된 목차는 최종적으로 JSON 형태로 반환되어 클라이언트에서 UI 렌더링에 사용됩니다.

## Syntax Highlighting: rehype-highlight

`rehype-highlight`는 코드 블록에 syntax highlighting을 해주는 rehype 플러그인 입니다. rehype 계열 플러그인이므로 `remark-rehype` 단계 이후에 위치해야합니다.

```tsx
unified()
  .use(remarkParse)
  .use(generateTOC)
  .use(remarkRehype)
  .use(rehypeHighlight) <--- 여기!!
  .use(rehypeStringify)
```

이 플러그인은 내부적으로 `highlight.js`를 사용하고, 제가 따로 언어를 명시하지 않아도 대부분의 코드 블록은 자동으로 언어를 감지하여 정확하게 하이라이팅됩니다.

테마도 굉장히 쉽게 적용해볼 수 있습니다. [highlight.js repo](https://github.com/highlightjs/highlight.js/tree/main/src/styles) 에서 원하는 theme css 를 찾아서 프로젝트 내에서 import 해주면 됩니다. 저는 github theme 을 사용했습니다. CSS 코드를 복사해서 globals.css 가 위치해 있는 `src/styles` 하위에 그대로 넣어줬습니다. 그리고 `src/app/layout.tsx`에서 import 해주었습니다.

```tsx
/* ... */
import "@/styles/globals.css";
import "@/styles/highlightjs-github-dark.css";
import "@/styles/highlightjs-github-light.css";

/* ... */
```

## 마치며

이 글에서는 제 블로그에 적용된 Markdown 처리 파이프라인을 소개했습니다. 핵심은 `unified` 과 그 플러그인들을 활용하여 변환 과정을 유연하게 커스터마이징 했다는 점 입니다.

덕분에 앞으로 글을 쓸 때마다 Markdown만 작성하면 자동으로 목차와 예쁜 코드가 적용됩니다.
