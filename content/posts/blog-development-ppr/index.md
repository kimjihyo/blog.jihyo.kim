---
tags: ["Blog", "Web", "Next.js"]
createdTime: "2025-05-30T00:00:00Z"
thumbnail: "https://res.cloudinary.com/dab33vdij/image/upload/v1748571636/blog-development-ppr_cagosa.png"
summary: "PPR을 사용해서 정적 페이지에 동적 컨텐츠를 렌더링하자"
updatedTime: "2025-05-30T00:00:00Z"
type: "dev-log"
title: "정적 페이지에 댓글 기능 추가하기"
---

## 서론

이전의 댓글 기능은 Giscus로 구현했다. Giscus는 GitHub의 Discussion을 이용해 별도의 DB 도입 없이 댓글 기능을 쉽게 구현 가능하게 해준다. 추가적으로, Giscus는 iframe에서 렌더링되기 때문에 정적 페이지에서 동적인 데이터인 댓글을 보여줄 수 있다.

Giscus는 이런 편리한 기능을 제공하지만, GitHub에 로그인 해야만 댓글을 작성할 수 있어, GitHub 계정이 없는 대부분의 비개발자들은 댓글 남기기가 어려워진다. 또 본인임을 드러내지 않고 가볍게 댓글을 남길 수도 없다.

이러한 이유 때문에 익명 댓글 기능을 구현하기로 했다. 이 기능을 구현하기 위해서 DB로는 Serverless PostgreSQL 서비스인 Neon을 사용했고 ORM으로는 Drizzle을 사용했다.

이 블로그의 포스트들은 빌드 타임에 정적인 HTML로 빌드된다 (SSG). 하지만 댓글은 동적인 데이터를 다루므로 매 페이지 요청마다 DB에서 데이터를 불러와 보여줘야 한다. 그럴려면 SSG를 포기하고 매 요청마다 서버에서 포스트랑 댓글을 렌더링해 클라이언트에게 넘겨줘야한다 (SSR).

익명 댓글 기능을 위해서 퍼포먼스를 희생하기는 싫어서 정적 컨텐츠와 동적 컨텐츠를 같은 페이지에서 사용하는 방법은 없을지 리서치 해봤다. 다행이도, Next.js에서 Partial Pre-Rendering (PPR)이라고 하는 기능을 실험적으로 제공하고 있다. 이 기능을 활용하면 정적 컨텐츠와 동적 컨텐츠를 한 페이지에서 사용할 수 있다.

이 글에서는 내가 어떻게 PPR을 도입했고 그 과정에서 겪은 시행착오들을 적어보려고 한다. 댓글 기능에 필요한 DB와 ORM 세팅 과정은 생략하고 PPR에 관한 내용에 집중하겠다.

## PPR 없이 일단 구현해보기

일단 PPR 없이 먼저 구현해보자. 아래 코드는 `app/posts/[...slug]/page.tsx` 이다 `generateStaticParams` 가 사용돼서 빌드 타임때 정적 HTML으로 미리 렌더링된다.

```tsx title="app/posts/[...slug]/page.tsx" showLineNumbers {1-3}
export async function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post._meta.path.split("/") }));
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostFromParams(params);

  if (!post) {
    return notFound();
  }

  return (
    <Shell className="relative md:grid md:grid-cols-[1fr_230px] gap-10">
      ...
    </Shell>
  );
}
```

자 여기에 DB에서 동적으로 데이터를 가져오는 서버 컴포넌트가 있다. `app/posts/[...slug]/_components/comment-section.tsx`

```tsx title="app/posts/[...slug]/_components/comment-section.tsx" showLineNumbers
export async function CommentSection({ postSlug }: CommentSectionProps) {
  const comments = await db
    .select()
    .from(commentsTable)
    .where(eq(commentsTable.postSlug, postSlug))
    .orderBy(desc(commentsTable.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="font-medium">댓글 {comments.length}</div>
        <div className="text-sm text-muted-foreground">
          댓글 관련 문의: kimjihyo0325@gmail.com
        </div>
      </div>
      <CommentForm postSlug={postSlug} />
      <Comments comments={comments} />
    </div>
  );
}
```

`ComponentSection` 을 `page.tsx` 에 추가해준다.

```tsx title="app/posts/[...slug]/page.tsx" showLineNumbers
/* ... */

export async function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post._meta.path.split("/") }));
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostFromParams(params);

  if (!post) {
    return notFound();
  }

  return (
    <Shell className="relative md:grid md:grid-cols-[1fr_230px] gap-10">
      ...
      <React.Suspense fallback={<div>Loading...</div>}>
        <CommentSection postSlug={post._meta.path} />
      </React.Suspense>
    </Shell>
  );
}

/* ... */
```

그리고 빌드해보면

```bash title="Terminal" showLineNumbers
Route (app)                                         Size  First Load JS
┌ ƒ /                                            1.28 kB         131 kB
├ ○ /_not-found                                  1.01 kB         112 kB
├ ○ /opengraph-image                               141 B         111 kB
├ ● /posts/[...slug]                             3.69 kB         130 kB
├   ├ /posts/blog-allPosts-function-optmization
├   ├ /posts/blog-development-1
├   ├ /posts/blog-development-2
├   └ [+7 more paths]
└ ○ /subscribe                                     141 B         111 kB
+ First Load JS shared by all                     111 kB
  ├ chunks/180-490d3129daccd5f4.js               45.5 kB
  ├ chunks/c27b23f4-20e247e05ddc5d40.js          63.7 kB
  └ other shared chunks (total)                  1.94 kB

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

`gernateStaticParams` 를 사용했기 때문에 빌드 타임때 정적 HTML로 프리렌더링 됐다. 그러면 포스트 페이지에 방문할 때마다 미리 렌더링 해둔 HTML만 서빙할 것이고 댓글은 빌드 시점때 기준의 데이터만 보여주고 업데이트는 안될 것이다.

간단하게 `gernateStaticParams` 를 제거해서 동적으로 요청시 마다 SSR 해주는 법도 있지만, 빌드 타임 프리렌더링의 퍼포먼스를 유지하고 싶기 때문에 PPR을 도입할 것이다.

## PPR 활성화 하기

`next.config.ts` 에서 PPR을 옵션을 incremental로 설정해준다.

```tsx
import type { NextConfig } from "next";

/* ... */

const nextConfig: NextConfig = {
  experimental: {
    ppr: "incremental",
  },
  /* ... */
};

/* ... */
```

그리고 PPR을 사용할 페이지에 `experimental_ppr` 을 export 해준다.

```tsx
/* ... */

export async function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post._meta.path.split("/") }));
}

/* here! */
export const experimental_ppr = true;

export default async function PostPage({ params }: PostPageProps) {
  /* ... */
}

/* ... */
```

그리고 빌드해보면

```bash title="Terminal" showLineNumbers
Route (app)                                         Size  First Load JS
┌ ƒ /                                            1.28 kB         131 kB
├ ○ /_not-found                                  1.01 kB         112 kB
├ ○ /opengraph-image                               141 B         111 kB
├ ◐ /posts/[...slug]                             3.69 kB         130 kB
├   ├ /posts/[...slug]
├   ├ /posts/[...slug]
├   ├ /posts/blog-allPosts-function-optmization
├   └ [+9 more paths]
└ ○ /subscribe                                     141 B         111 kB
+ First Load JS shared by all                     111 kB
  ├ chunks/180-490d3129daccd5f4.js               45.5 kB
  ├ chunks/c27b23f4-20e247e05ddc5d40.js          63.7 kB
  └ other shared chunks (total)                  1.94 kB

○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
ƒ  (Dynamic)            server-rendered on demand
```

`posts/[...slug]` 페이지들이 SSG에서 Partial Prerender로 변한것을 확인할 수 있다.

부푼 기대감을 가지고 테스트 해보았지만, 댓글은 여전히 업데이트가 안되고 있었다. 조금의 리서치를 해본 결과 컴포넌트가 동적이게 되려면 아래와 같은 조건을 만족해야 한다고 한다.

> A component becomes dynamic if it uses the following APIs:
>
> - [`cookies`](https://nextjs.org/docs/app/api-reference/functions/cookies)
> - [`headers`](https://nextjs.org/docs/app/api-reference/functions/headers)
> - [`connection`](https://nextjs.org/docs/app/api-reference/functions/connection)
> - [`draftMode`](https://nextjs.org/docs/app/api-reference/functions/draft-mode)
> - [`searchParams` prop](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional)
> - [`unstable_noStore`](https://nextjs.org/docs/app/api-reference/functions/unstable_noStore)
> - [`fetch`](https://nextjs.org/docs/app/api-reference/functions/fetch) with `{ cache: 'no-store' }`

동적 컴포넌트이어야할 현재의 `ComponentSection` 은 위의 조건을 만족하지 않고 있어서 Next.js에서 정적 컴포넌트로 인식해버린 것이였다. 그래서 아래와 같이 `connection` 을 사용해서 동적 컴포넌트임을 명시해줬다.

```tsx title="app/posts/[...slug]/_components/comment-section.tsx" showLineNumbers
export async function CommentSection({ postSlug }: CommentSectionProps) {
  await connection();
  const comments = await db
    .select()
    .from(commentsTable)
    .where(eq(commentsTable.postSlug, postSlug))
    .orderBy(desc(commentsTable.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="font-medium">댓글 {comments.length}</div>
        <div className="text-sm text-muted-foreground">
          댓글 관련 문의: kimjihyo0325@gmail.com
        </div>
      </div>
      <CommentForm postSlug={postSlug} />
      <Comments comments={comments} />
    </div>
  );
}
```

## 결론

결과적으로 잘 작동해주었다. Next.js와 한껏 더 친해진 계기가 되었다. 군대 다녀온 사이 Next.js에 정말 많은 새로운 기능들이 추가되어서 매일 너무 재밌게 공부하면서 사용해보고 있다. 하지만 너무 많은 기능이 복잡하게 얽혀있어서 조금 프레임워크가 어려워진 감은 있다.
