---
tags: ["Blog", "Web"]
createdTime: "2025-04-10T00:00:00Z"
thumbnail: "https://res.cloudinary.com/dab33vdij/image/upload/v1744274494/IMG_0433_rpc9c7.png"
summary: "블로그의 필수 기능이라고 볼 수 있는 댓글 기능 입니다. 처음 이 블로그를 만들 때는 댓글 기능을 도입할 생각은 없었는데 친구가 추가해달라고 제안을 해주었고 생각을 해보니 있으면 재밌을 것 같아 이번에 추가하게 되었습니다."
updatedTime: "2025-04-10T00:00:00Z"
type: "post"
title: "블로그 개발 - 백엔드/DB 없이 손쉽게 댓글 기능 추가하기"
---

## 시작

블로그의 필수 기능이라고 볼 수 있는 댓글 기능 입니다. 처음 이 블로그를 만들 때는 댓글 기능을 도입할 생각은 없었는데 친구가 추가해달라고 제안을 해주었고 생각을 해보니 있으면 재밌을 것 같아 이번에 추가하게 되었습니다.

## 후보군

댓글 기능을 구현하려면 댓글을 저장할 DB와 관련된 로직을 처리할 곳이 필요합니다. 이를 따로 구현하기는 번거로운 일이 아닐 수 없습니다. 그래서 제 블로그에 사용한 방법은 `Giscus`라는 라이브러리 입니다. 따로 댓글을 위한 DB를 두지 않고 Github Repository의 Discussiond에 댓글을 저장하여 API로 불러와서 사용하는 형태입니다.

따로 DB를 두지 않고 블로그에 댓글 기능을 추가하기 위해서 사용하는 것들은 Giscus 이외에도 대표적으로 아래와 같이 있습니다.

- Disqus
- Utterances

Disqus는 가장 오래되고 널리 사용되는 서드파티 댓글 시스템입니다. 댓글은 Disqus 서버에 저장되고 별도의 관리자 기능도 제공됩니다. 다만 오픈소스가 아니고 무료 플랜을 사용하면 광고가 삽입된다는 단점이 있습니다. 저에게는 필요없는 기능들이 많아 보이고 결정적으로 유료 플랜을 사용해야만 광고를 지울 수 있다고 하길래 저는 결국 사용하지 않기로 했습니다.

Utterances는 Giscus와 비슷하게 Github Issue에 댓글을 저장합니다. 완전 오픈소스이고 Github의 Stars도 글을 작성하는 시점에는 더 많습니다. 하지만 최근에 commit 된 것이 없다는 점과 찾아보니 많은 사람들이 Utterances에서 Giscus로 넘어가고 있다는 점을 고려해봤을 때 저는 Giscus를 사용하기로 결정했습니다.

제가 생각하는 Giscus의 단점이라면 GitHub 계정이 없으면 댓글 작성이 불가능 하다는 점 입니다. 비개발자들은 GitHub 계정을 많이 없으실 것 같고 댓글을 작성하는 방식이 Markdown이라 익숙하지 않을 수 있을 것 같다는 생각이 들었습니다.
하지만 제 블로그에 방문하시는 대부분의 사람들은 개발자일거라 이 부분은 크게 문제가 되지 않을거라 판단이 되었습니다.

## 본격적으로 Giscus 추가하기

지금 이 블로그는 Next.js로 만들어 졌습니다. 그래서 이 글에서는 Next.js 프로젝트에 Giscus를 추가하는 방법에 대해서 간단히 소개해보도록 하겠습니다. 공식 문서는 여기 -> [here](https://giscus.app)
참고로 Giscus를 추가할 프로젝트의 repository는 public 이여야 합니다.

### GitHub Discussions 활성화 하기

우선 GitHub에 프로젝트 repository로 가줍니다. 그런 다음 Settings를 클릭해 repo 설정 페이지로 가줍니다.

![github_discussions_img1](https://res.cloudinary.com/dab33vdij/image/upload/v1744274082/IMG_0428_nklsbb.jpg)

스크롤을 내리다보면 Features 섹션에 여러가지 기능들을 활성화 할 수 있는 곳이 나옵니다. 여기서 Discussions를 체크해 활성화 시켜줍니다.

![github_discussions_img1](https://res.cloudinary.com/dab33vdij/image/upload/v1744274083/IMG_0429_y2wyhu.jpg)

### Repository에 Giscus App설치하기

다음으로는 GitHub에서 giscus app을 설치해 주어야 합니다. [giscus app](https://github.com/apps/giscus)에서 Install 버튼을 클릭해 설치해줍니다. 모든 read / write access를 모든 repositories들에 줄건지 선택한 몇개의 repository에 줄건지 고를 수 있는데 저는 제 블로그 프로젝트 repository에만 설정해주었습니다.

![github_giscus_app1](https://res.cloudinary.com/dab33vdij/image/upload/v1744274082/IMG_0430_jyrym2.jpg)

### Giscus 연결하기

이제 Discussions도 활성화 했고, giscus app도 설치해 주었으니 본격적으로 연결해볼 시간 입니다. [Giscus 공식 사이트](https://giscus.app/)으로 가셔서 Configuration 섹션으로 스크롤 해줍니다.

Repository에는 GitHub 유저네임이랑 repository 이름을 적어줍니다.

![giscus_app_repo_img](https://res.cloudinary.com/dab33vdij/image/upload/v1744274083/IMG_0431_ngfier.jpg)

그리고 잘 읽어보고 원하는 설정에 체크를 해주면 입력한 정보에 맞게 `script` 테그가 자동 생성됩니다. 일단 이 걸 잘 가지고 있다가 다음에 추가할 React component에 props로 넘겨줄 것입니다.

![giscus_app_script_img](https://res.cloudinary.com/dab33vdij/image/upload/v1744274083/IMG_0432_pzuxew.jpg)

### Giscus 컴포넌트 추가하기

Giscus에서 공식적으로 React에서 사용할 수 있도록 @giscus/react 라는 라이브러리를 제공합니다. 아래 명령어를 실행하여 Next.js 프로젝트에 설치해줍니다. 제 프로젝트에서는 pnpm을 사용하므로 pnpm으로 설치했습니다.

```bash
pnpm add @giscus/react
```

다음으로 저는 아래와 같이 Comments라는 컴포넌트를 만들어 주었습니다.

```tsx
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
```

props는 직전에 만든 script 태그에서 가지고와 사용하면 됩니다.
이 Comments 컴포넌트를 `src/app/posts/[...slug]/page.tsx`에서 임포트하여 사용했습니다.

```tsx
import Comments from "@/components/comments";

// ...

export default async function PostPage({ params }: PostPageProps) {
  // ...

  return (
    <Shell className="relative md:grid md:grid-cols-[1fr_230px] gap-10">
      <div className="min-w-0">
        {/* ... */}
        <h1 className="font-bold leading-tight tracking-tighter lg:leading-[1.1] text-2xl md:text-3xl">
          {post.title}
        </h1>
        <div className="markdown mb-14">
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
        <div>
          <Comments />
        </div>
      </div>
      {/* ... */}
    </Shell>
  );
}
```

## 마무리

정말 쉽게 블로그에 댓글 기능을 추가할 수 있었습니다. 이 글이 조금이나마 도움이 되었으면 좋겠습니다. Giscus를 테스트 해보고 싶으시면 여기에 댓글 달아주셔도 좋습니다.

읽어주셔서 감사합니다.
