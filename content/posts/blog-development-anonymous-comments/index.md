---
tags: ["Blog", "Web"]
createdTime: "2025-05-29T00:00:00Z"
thumbnail: "https://res.cloudinary.com/dab33vdij/image/upload/v1744025252/IMG_0423_m1zet6.png"
summary: "이번 글에서는 제가 이 블로그 프로젝트에서 어떤 스타일링 라이브러리와 UI 컴포넌트 라이브러리를 사용했는지 소개하고 어떻게 세팅해 주었는지 보여드리겠습니다."
updatedTime: "2025-05-29T00:00:00Z"
title: "Next.js Partial Pre-rendering으로 익명 댓글 기능 만들기"
---

## 서론

### Giscus의 한계

기술 블로그를 운영하면서 독자들과의 소통 창구가 필요하다는 생각에 댓글 기능을 도입했다. 초기에는 Giscus를 사용했다. Giscus는 GitHub Discussions를 기반으로 동작하며, iframe을 통해 댓글 UI를 삽입하는 방식이라 별도의 백엔드 없이도 정적 페이지(SSG)의 장점을 그대로 유지할 수 있다는 점에서 매력적이었다.

하지만 Giscus에는 몇 가지 중요한 제약이 있었다.

- GitHub 로그인 필수: 댓글을 달기 위해선 GitHub 계정이 필요하다.
- 익명 댓글 불가: 댓글에 GitHub 프로필이 노출되므로 익명성이 보장되지 않는다.
- 비개발자 접근성 낮음: 기술 블로그임에도 독자 중에는 GitHub 계정이 없는 경우가 많아, 참여가 어렵다.

이런 제약 때문에 더 자유로운 피드백을 받을 수 있도록 익명 댓글 기능을 직접 구현하게 되었다.

### 기술적 챌린지

하지만 여기에도 기술적인 도전이 있었다. 블로그는 Next.js의 App Router 기반으로 구성되어 있고, 각 게시글 페이지는 generateStaticParams와 generateMetadata를 활용해 정적 생성(SSG) 방식으로 만들어진다. 이 구조에서는 정적으로 생성된 페이지 내에 동적인 댓글 데이터를 포함시키기 어렵다. 클라이언트 측에서 fetch를 통해 댓글을 불러오게 되면, 전체 페이지가 dynamic rendering으로 간주되어 SSG의 장점을 잃게 된다.

이를 해결하기 위해 Next.js의 최신 기능인 Partial Pre-rendering (PPR) 을 도입했다. PPR은 페이지의 일부만 동적으로 렌더링하면서 나머지 영역은 정적으로 유지할 수 있는 기능으로, 이번 댓글 기능에 매우 적합한 방식이었다.

## 사용한 기술 스택 소개

이번 익명 댓글 기능 구현에는 **static rendering**과 **dynamic rendering**의 장점을 모두 확보하기 위해 다음과 같은 기술 스택을 선택했다.

### Next.js (App Router + Partial Pre-rendering)

Next.js의 **App Router** 기반 프로젝트로, 각 포스트 페이지는 `generateStaticParams`를 통해 정적으로 생성하고 있다. 여기에 실시간 댓글 기능을 더하기 위해 Next.js의 **Partial Pre-rendering (PPR)** 기능을 도입했다. PPR을 사용하면 페이지 전체가 dynamic 처리되지 않고, **댓글 컴포넌트만 클라이언트 측에서 렌더링**되도록 분리할 수 있다. 이를 통해 정적 페이지의 빠른 로딩 속도와 SEO 이점을 그대로 유지할 수 있다.

### Neon DB (PostgreSQL 기반 서버리스 DB)

댓글 데이터를 저장할 DB로는 **Neon**을 선택했다. Neon은 PostgreSQL 기반의 서버리스 클라우드 데이터베이스로, **Connection Pooling**, **Branching**, **자동 스케일링** 등의 기능을 제공한다. Vercel과의 연동도 간편해 서버리스 환경에서 사용하기에 적합하다.

### Drizzle ORM

ORM으로는 **Drizzle**을 사용했다. Drizzle은 타입 안전성과 경량성을 갖춘 SQL 기반 ORM으로, Prisma보다 **빌드 타임과 실행 속도가 빠르고**, **타입 추론이 명확**하다는 점이 장점이다. 특히 서버리스 환경에서 동작하는 Neon과 함께 사용할 때 과도한 추상화를 피할 수 있어 잘 어울린다.
