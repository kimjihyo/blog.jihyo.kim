---
tags: ["Blog", "Web"]
createdTime: "2025-05-06T00:00:00Z"
thumbnail: "https://res.cloudinary.com/dab33vdij/image/upload/v1746534986/IMG_0488_f8jh2y.png"
summary: "불필요하게 커지는 클라이언트 번들 사이즈 미연에 방지하기 워한 고민"
updatedTime: "2025-05-06T00:00:00Z"
type: "trouble-shooting"
title: "글 목록에서 본문까지 불러온다고? 무심코 만든 구조의 숨은 비용"
---

## 문제 상황

정적 블로그를 개발하면서 `content-collections` 라이브러리를 사용하고 있다. 이 라이브러리는 Markdown 파일을 읽어 타입 세이프한 콘텐츠 컬렉션을 만들고, `allPosts()` 같은 헬퍼 함수를 자동으로 생성해준다.

`allPosts()`는 블로그 글 목록을 렌더링할 때 자주 사용된다. 하지만 이 함수는 각 글의 본문까지 포함한 전체 데이터를 반환한다. 글 목록에는 본문이 필요 없기 때문에, 이 동작이 의도치 않은 문제를 일으킬 수 있다.

App Router 환경에서 글 목록 페이지는 서버 컴포넌트로 렌더링된다. 이 경우에는 `allPosts()`를 호출해도 클라이언트 번들에는 영향을 주지 않는다.
하지만 개발자가 실수로 이 데이터를 클라이언트 컴포넌트에 넘기거나, 클라이언트 컴포넌트 내부에서 사용하게 되면, 본문까지 포함된 데이터가 클라이언트로 전달되고 번들 사이즈가 불필요하게 커진다.

이 글에서는 그런 실수를 방지하기 위한 구조적 해결 방법을 정리한다.

## 원인 분석

`allPosts()`는 아래와 같은 구조의 객체 배열을 반환한다:

```ts
{
  slug: 'example-post',
  data: {
    title: 'Example Post',
    date: '2024-01-01',
    thumbnail: '/thumb.jpg',
    tags: ['nextjs', 'content'],
  },
  body: '<h1>Example</h1> ...' // 본문 전체
}
```

글 목록에는 `title`, `date`, `thumbnail` 정도만 필요하다. 하지만 실수로 이 전체 데이터를 클라이언트에 넘기면 다음과 같은 문제가 발생한다:

- 클라이언트로 전달되는 데이터 크기가 커진다
- 초기 페이지 로딩 시 큰 JSON 페이로드가 전송된다
- 글 수가 많아질수록 번들 사이즈가 계속 증가한다

## 해결 방법

본문을 포함하지 않고, 글 목록에 필요한 필드만을 담는 전용 컬렉션을 `defineCollection()`을 사용해 별도로 정의한다.

```ts
import { defineCollection } from "content-collections";

export const postMetas = defineCollection({
  name: "postMetas",
  pattern: "posts/*/index.md",
  schema: ({ z }) =>
    z.object({
      title: z.string(),
      date: z.string(),
      thumbnail: z.string(),
      tags: z.array(z.string()),
    }),
});
```

이 컬렉션은 Markdown 본문을 포함하지 않으며, 필요한 메타 정보만을 안전하게 제공한다.

글 목록에서는 자동 생성된 `allPostMetas()` 함수를 사용해 메타데이터만 불러온다:

```tsx
// app/page.tsx
import { allPostMetas } from "content-collections";
import PostList from "@/components/PostList";

export default function HomePage() {
  const posts = allPostMetas();
  return <PostList posts={posts} />;
}
```

현재 `PostList`는 서버 컴포넌트이기 때문에 문제가 없지만, 미래에 클라이언트 컴포넌트로 변경되더라도 안전하게 사용할 수 있도록 구조를 미리 분리한 것이다.

## 마무리

글 목록 구성에 본문이 포함된 전체 데이터를 사용하는 것은 눈에 띄지 않지만, 점점 커지는 번들 사이즈로 이어질 수 있다.
초기에는 서버 컴포넌트에서 문제가 없어 보여도, 클라이언트로 데이터를 넘기거나 컴포넌트 구조가 바뀌는 순간 성능 저하의 원인이 될 수 있다.

메타데이터 전용 컬렉션을 분리해 사용하는 것은 이런 실수를 구조적으로 방지하는 방법이다. 지금은 필요 없어 보여도, 미래의 나를 위한 좋은 예방 조치가 된다.
