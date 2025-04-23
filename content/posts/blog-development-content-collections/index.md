---
tags: ["Blog", "Web"]
createdTime: "2025-04-13T00:00:00Z"
thumbnail: "https://res.cloudinary.com/dab33vdij/image/upload/v1744535052/blog-development-thumbnail_mj7wzg.png"
summary: "마크다운으로 된 글을 타입 안전하게 다룰 수 있게 도와주는 content-collections 라이브러리에 대해서 알아봅니다."
updatedTime: "2025-04-13T00:00:00Z"
type: "post"
title: "블로그 개발 - content-collections으로 콘텐츠 관리하기"
---

## 시작

이 블로그는 정적 블로그 입니다. 다시 말해, 블로그 컨텐츠가 미리 생성되어 서버에 저장되어 있고, 사용자 요청 시 서버에서 추가적인 처리 없이 저장된 파일을 그대로 제공합니다.

서버에서 추가적인 처리 없이 콘텐츠를 제공하므로, 동적 블로그에 비해 로딩 속도가 빠릅니다. 또한 DB 쿼리 같은 요청을 안해도 되기 때문에 서버 부하가 적습니다. 또한 정적 HTML 파일로 구성되어 있어 검색 엔진이 콘텐츠를 쉽게 파싱하고 인덱싱할 수 있습니다.

## content-collections 발견

저는 정적 콘텐츠를 쉽게 다를 수 있게 해주는 content-collections 라이브러리를 사용했습니다. 전에는 많은 정적 블로그에서 `contentlayer`라는 라이브러리를 사용했습니다. 하지만 해당 라이브러리는 archived되어 더 이상 유지보수되지 않고 있습니다.

그래서 `contentlayer` 대안을 찾아보기로 했습니다. 아래와 같은 조건을 따져보았습니다.

- 마크다운으로 된 글을 타입 안전하게 다룰 수 있게 해주어야 함
- 현재 유지보수가 잘 되고 있어야 함
- Frontmatter 같이 마크다운 문서에서 메타데이터를 저장할 수 있어야함

해당 조건을 다 만족하는 `content-collections`라는 라이브러를 발견하였습니다.

## content-collections 소개

content-collections는 md(마크다운) 이나 mdx 등의 콘텐츠가 담긴 파일을 읽어서 next 같은 프레임워크에서 쉽게 사용할 수 있도록 타입 안전하게 추상화 레이어를 만들어 줍니다.

마크다운 안에 frontmatter 형식으로 메타데이터도 담을 수 있고 zod 라이브러리와 함께 사용되어 콘텐츠의 스키마도 정의할 수 있습니다.

## Next.js에서 사용해보기

[Official Documentation](https://www.content-collections.dev/docs/quickstart/next) 에서 사용법을 친절하게 안내해주고 있습니다.

여기서는 Next.js 에서 제가 사용하고 있는 설정을 소개해드리겠습니다.

### 기본적인 사용법

**패키지 설치하기**

우선 두가지 패키지를 설치해줍니다.

- `@content-collections/core`
- `@content-collections/next`

core는 content-collections 패키지의 핵심 기능을 포함하고 있고 next는 next에 특정적인 기능들을 포함하고 있습니다. Next.js를 사용하고 있으므로 저 두 패키지를 설치해줍니다.

```bash
pnpm add @content-collections/core @content-collections/next -D
```

**tsconfig.json 수정하기**

`tsconfig.json` 파일을 아래와 같이 수정해줍니다.

```json
{
  "compilerOptions": {
    // ...
    "paths": {
      "@/*": ["./*"],
      "content-collections": ["./.content-collections/generated"]
    }
  }
}
```

content-collections는 `./.content-collections/generated` 폴더에 저희가 작성한 마크다운을 파싱하여 파일을 생성합니다. 이를 참조하기 위해서 `tsconfig.json`에 path alias를 추가해줍니다.

**nextjs.config.ts 수정하기**

```ts
import type { NextConfig } from "next";
import { withContentCollections } from "@content-collections/next";

const nextConfig: NextConfig = {
  /* config options here */
};

// withContentCollections must be the outermost plugin
export default withContentCollections(nextConfig);
```

위와 같이 수정하여 content-collections를 빌드시에 포함시키게 합니다.

**.content-collections 디렉토리 .gitignore에 추가하기**

`.content-collections` 폴더는 매 빌드시 새롭게 생성됩니다. 따라서 `.gitignore`에 추가해줍시다.

**content-collections.ts 파일 만들기**

프로젝트 루트 디렉토리에 `content-collections.ts` 파일을 만들어 아래와 같이 적어줍니다.

```ts
import { defineCollection, defineConfig } from "@content-collections/core";

const posts = defineCollection({
  name: "posts",
  directory: "./content/posts",
  include: "**/*.md",
  schema: (z) => ({
    title: z.string(),
    summary: z.string(),
    createdTime: z.string(),
    updatedTime: z.string(),
    tags: z.array(z.string()),
    type: z.enum(["post", "translation"]),
    thumbnail: z.string().optional(),
  }),
});

export default defineConfig({
  collections: [posts],
});
```

`./content/posts` 폴더 위치한 posts라는 이름을 갖는 collections을 정의하는 코드 입니다. `/content/posts/` 폴더에 `**/*.md` 패턴을 갖는 모든 마크다운은 posts 로 간주될 것이고 schema는 zod의 기능을 이용해서 title, summary, createdTime … 등을 갖습니다.

**`content/posts/hello-world.md` 만들어보기**

테스트로 `content/posts/hello-world.md` 만들어봅시다.

```md
---
tags: [“Test”]
createdTime: "2025-04-02T00:00:00Z"
thumbnail: "https://res.cloudinary.com/dab33vdij/image/upload/v1744025393/IMG_0424_dugtl4.png"
summary: “Hello world yo”
updatedTime: "2025-04-02T00:00:00Z"
type: "post"
title: “Hello world”
---

# Hello world

첫번째 포스트!!!
```

이렇게 작성해주고 Next.js 를 `dev`로 실행하거나 빌드를 하면 content-collections에 의해서 posts collections에 추가가 됩니다.

**Posts 컴포넌트 만들어보기**

```tsx
import { allPosts } from "content-collections";

export default function Posts() {
  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post._meta.path}>
          <a href={`/posts/${post._meta.path}`}>
            <h3>{post.title}</h3>
            <p>{post.summary}</p>
          </a>
        </li>
      ))}
    </ul>
  );
}
```

공식 문서의 예제를 그대로 들고왔습니다. 위 와 같이 코드상에서 사용할 수 있습니다. 하지만 블로그의 컨텐츠를 보여주기 위해서는 저희가 작성한 마크다운을 html로 변환해주는 과정이 필요합니다.

### 마크다운 html로 변환하기

collections의 콘텐츠를 마크다운에서 html로 변환하기 위해서 transform 함수를 이용하면 됩니다. transform 함수는 `defineCollections` 함수 인자 object의 property로 건내주면 됩니다.
마크다운을 html로 변환해주는 함수는 `@content-collections/markdown` 패키지를 설치하여 사용할 수 있습니다. 간단하게는 아래와 같이 사용해볼 수 있습니다.

```ts
transform: async (doc, { cache }) => {
  const html = await cache(doc.content, async (content) => {
    return markdownToHtml(content);
  });

  return {
    ...doc,
    html,
  };
};
```

이렇게 변환된 html은 Next.js에서 아래와 같이 사용할 수 있습니다.

```tsx
export default function Page({ params }) {
  const post = getPost(params.id);
  return (
    <div className="markdown mb-14">
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </div>
  );
}
```

## 마무리

이번 글에서는 `content-collections`의 기본적인 사용법을 알아봤습니다. 이 라이브러리의 장점은 transform 시에 다양한 플러그인들을 사용할 수 있다는 점 입니다.
사용할 수 있는 플러그인의 종류로는 rehype과 remark가 있습니다. 이 플러그인들을 사용을 해서 포스팅내의 코드 영역 syntax highlighting 과 목차 같은 기능들을 추가적으로 구현할 수 있습니다.

다음에 기회가 되면 제가 어떻게 해당 플러그인들을 사용하고 있는지 소개하는 시간을 가져보도록 하겠습니다.
