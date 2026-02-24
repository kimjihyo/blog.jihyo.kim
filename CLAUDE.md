# CLAUDE.md

이 문서는 AI 에이전트가 이 프로젝트에서 작업할 때 참고해야 할 가이드입니다.

> **이 문서를 항상 최신 상태로 유지하세요.** 프로젝트 구조, 아키텍처, 컨벤션, 의존성 등이 변경될 때 반드시 CLAUDE.md도 함께 업데이트해야 합니다. 새로운 라우트, 컴포넌트 패턴, 환경 변수, 스크립트 등이 추가되면 해당 섹션에 반영하세요.

## 프로젝트 개요

개인 블로그 ([blog.jihyo.kim](https://blog.jihyo.kim)). MDX 기반의 정적 콘텐츠와 댓글 시스템을 위한 서버사이드 기능을 함께 갖춘 Next.js 애플리케이션입니다. 홈 페이지는 PPR(Partial Prerendering)로 동작하여 정적 쉘은 즉시 서빙하고, 최근 댓글은 `"use cache"` + `cacheLife("minutes")`로 캐시합니다.

## 기술 스택

- **프레임워크**: Next.js 16 (App Router, Turbopack, `cacheComponents: true`)
- **언어**: TypeScript (strict mode)
- **스타일링**: Tailwind CSS 4 + shadcn/ui (Radix UI 기반)
- **색상 시스템**: Flexoki (OKLch 색공간, 라이트/다크 모드)
- **콘텐츠**: MDX (remark/rehype 플러그인 체인)
- **데이터베이스**: Neon PostgreSQL + Drizzle ORM
- **패키지 매니저**: pnpm
- **배포**: Vercel (Analytics + Speed Insights)
- **테스트**: Vitest + Testing Library
- **린팅/포맷팅**: ESLint + Prettier (prettier-plugin-tailwindcss)

## 프로젝트 구조

```
/
├── content/              # MDX 블로그 포스트 파일
├── .data/                # 빌드 시 생성되는 JSON (posts.json, tags.json)
├── scripts/              # 콘텐츠 빌드 스크립트
│   ├── generate-posts-data.js   # MDX → JSON 변환 + 검색 인덱스 생성
│   └── watch-posts.js           # 개발 시 콘텐츠 변경 감지
├── drizzle/              # DB 마이그레이션 파일
├── public/               # 정적 에셋 (search-index.json 포함)
├── src/
│   ├── app/
│   │   ├── layout.tsx           # 루트 레이아웃 (폰트, 테마, 메타데이터)
│   │   ├── sitemap.ts           # XML 사이트맵 생성
│   │   ├── robots.ts            # SEO robots 설정
│   │   ├── manifest.ts          # PWA 매니페스트
│   │   ├── opengraph-image.tsx  # OG 이미지 동적 생성 (사이트 전역)
│   │   ├── feed.xml/route.ts    # Atom 피드
│   │   ├── rss.xml/route.ts     # RSS 2.0 피드
│   │   └── (main-layout)/       # 헤더/푸터 공유 레이아웃 그룹
│   │       ├── (home)/               # 홈 페이지 (PPR)
│   │       │   └── _components/      # 포스트 목록, 최근 댓글
│   │       ├── posts/
│   │       │   ├── [slug]/           # 개별 포스트 페이지 (PPR)
│   │       │   │   └── opengraph-image.tsx  # 포스트별 OG 이미지
│   │       │   ├── utils.ts          # getBlogPosts(), getAllTags() 등
│   │       │   ├── _actions/         # 서버 액션 (댓글 제출)
│   │       │   ├── _components/      # 댓글, 목차 등
│   │       │   └── _utils/           # 랜덤 아바타/닉네임 생성
│   │       ├── tags/                 # 태그 목록 (SSG)
│   │       │   └── [tag]/[page]/     # 태그별 페이지네이션 (SSG)
│   │       └── search/              # 검색 (클라이언트 사이드)
│   │           └── _components/     # 검색 UI
│   ├── components/
│   │   ├── ui/              # shadcn/ui 기반 공용 컴포넌트
│   │   ├── layouts/         # 헤더, 푸터, 테마 토글
│   │   ├── icons.tsx        # SVG 아이콘 (GitHub, RSS, Translate)
│   │   ├── image-lightbox.tsx  # 이미지 확대 모달 (native dialog)
│   │   └── shell.tsx        # 컨테이너 래퍼
│   ├── config/site.ts      # 사이트 설정 (이름, URL, 링크)
│   ├── db/
│   │   ├── index.ts         # Drizzle 클라이언트 초기화 (server-only)
│   │   └── schema.ts        # comments, subscriptions 테이블
│   ├── lib/utils.ts         # cn(), formatDate() 유틸리티
│   ├── styles/
│   │   ├── app.css          # 메인 스타일시트 (모든 CSS import)
│   │   ├── theme.css        # Flexoki 색상 변수 (라이트/다크)
│   │   ├── tokens.css       # Tailwind 커스텀 디자인 토큰
│   │   ├── code.css         # 코드 하이라이팅 스타일
│   │   ├── prose.css        # 타이포그래피 오버라이드
│   │   ├── base.css         # 기본 스타일
│   │   └── animation.css    # 커스텀 애니메이션
│   └── assets/fonts/        # Pretendard 가변 폰트
├── mdx-components.tsx       # MDX 커스텀 컴포넌트 매핑
└── next.config.mjs          # Next.js + MDX + 번들 분석기 설정
```

## 라우팅 구조

| 라우트 | 렌더링 | 설명 |
|--------|--------|------|
| `/` | PPR | 최신 8개 포스트 + 사이드바(태그 링크, 최근 댓글 cache component) |
| `/posts/[slug]` | PPR | 개별 포스트 + 댓글 (댓글은 동적) |
| `/tags` | SSG (Static) | 태그 목록 (카드 형태, 미리보기 포함) |
| `/tags/[tag]/[page]` | SSG (PPR) | 태그별 포스트 목록 + 페이지네이션 |
| `/tags/all/[page]` | SSG (PPR) | 전체 포스트 목록 + 페이지네이션 |
| `/search` | SSG (Static) | 클라이언트 사이드 검색 (빌드 시 인덱스 생성) |
| `/feed.xml` | Route Handler | Atom 피드 (캐시 3600s + stale-while-revalidate) |
| `/rss.xml` | Route Handler | RSS 2.0 피드 |

- **`/tags/all/1`**: 모든 포스트를 보여주는 전체 목록
- **`/tags/{태그명}/1`**: 특정 태그로 필터링된 포스트 목록
- 모든 태그/페이지 조합은 `generateStaticParams`로 빌드 타임에 정적 생성

## 주요 명령어

```bash
pnpm dev          # 개발 서버 (콘텐츠 워처 + Turbopack)
pnpm dev:next     # Next.js 개발 서버만 실행 (워처 없이)
pnpm build        # 프로덕션 빌드 (prebuild로 콘텐츠 JSON 자동 생성)
pnpm lint         # ESLint + Prettier 실행
pnpm test         # Vitest 테스트 실행
pnpm test:watch   # Vitest watch 모드
pnpm db:push      # DB 스키마 반영
pnpm db:generate  # 마이그레이션 생성
pnpm db:migrate   # 마이그레이션 실행
pnpm db:studio    # Drizzle Studio (DB GUI)
```

## 콘텐츠 관리

### 블로그 포스트 작성

- `/content` 디렉토리에 `.mdx` 파일로 작성
- 파일명이 URL 슬러그가 됨 (예: `my-post.mdx` → `/posts/my-post`)
- 프론트매터 형식:

```yaml
---
title: "포스트 제목"
tags: ["태그1", "태그2"]
createdTime: "2025-01-01T00:00:00.000Z"
updatedTime: "2025-01-01T00:00:00.000Z"
thumbnail: "https://res.cloudinary.com/..."
summary: "포스트 요약"
---
```

### 콘텐츠 빌드 파이프라인

1. `scripts/generate-posts-data.js`가 MDX 파일의 프론트매터를 파싱
2. `.data/posts.json`, `.data/tags.json`에 정적 데이터 생성
3. `public/search-index.json`에 검색용 경량 인덱스 생성 (slug, title, summary, tags)
4. 앱에서는 JSON을 import하여 사용 (파일시스템 접근 불필요)
5. 개발 시 `scripts/watch-posts.js`가 콘텐츠 변경을 감지하여 자동 재생성

## 아키텍처 원칙

### 정적 우선 (Static-First)

- 포스트/태그 데이터는 빌드 시 JSON으로 프리컴파일 → 런타임 파일시스템 접근 없음
- `generateStaticParams`로 모든 가능한 경로를 빌드 타임에 정적 생성
- 동적 데이터(댓글)만 서버에서 런타임 처리

### 서버 컴포넌트 우선 (Server Component First)

- **Server Component가 기본**. `"use client"`는 반드시 필요한 경우에만 사용
- **클라이언트 컴포넌트의 범위를 최소화** — 페이지나 레이아웃 단위로 `"use client"`를 선언하지 않고, 인터랙션이 필요한 최소 단위의 리프 컴포넌트에만 적용
- 현재 `"use client"` 사용처 (이 목록 외에 불필요하게 늘리지 말 것):
  - `comment-form.tsx` — 폼 상태, localStorage, 애니메이션
  - `table-of-contents-pc.tsx`, `table-of-contents-mobile.tsx` — IntersectionObserver
  - `search-client.tsx` — 클라이언트 사이드 검색
  - `image-lightbox.tsx` — 이미지 확대 모달 (dialog API)
  - `mode-switch.tsx` — 테마 토글 (next-themes)
  - `ui/` 일부 — shadcn/ui가 내부적으로 필요로 하는 것만 (avatar, switch, label, image)

### 캐싱 전략

- **PPR (Partial Prerendering)**: 홈, 포스트 페이지에서 정적 쉘은 즉시 서빙
- **`"use cache"` + `cacheLife("minutes")`**: 최근 댓글처럼 자주 바뀌지만 실시간일 필요 없는 데이터
- **`revalidatePath()`**: 댓글 작성 시 해당 포스트 경로 캐시 무효화
- **Route Handler 캐시**: RSS/Atom 피드에 `Cache-Control` 헤더 설정

### 데이터 흐름

```
MDX 파일 → generate-posts-data.js → .data/*.json → getBlogPosts() → 페이지 렌더
                                   → public/search-index.json → 클라이언트 검색

댓글 작성 → submitComment() 서버 액션 → Zod 검증 → Drizzle INSERT
         → revalidatePath() → Discord 웹훅 알림 (선택)
```

## 코딩 컨벤션

### 파일/디렉토리 네이밍

- `_components/`, `_actions/`, `_utils/`: 해당 라우트 전용 내부 모듈 (접두사 `_`)
- `(group-name)/`: Next.js 라우트 그룹 (URL에 영향 없음)
- 컴포넌트 파일: kebab-case (예: `site-header.tsx`, `post-list-item.tsx`)
- 타입/인터페이스: PascalCase (예: `BlogPost`, `Frontmatter`)

### 컴포넌트 패턴

- shadcn/ui 컴포넌트는 `src/components/ui/`에 위치
- CVA(Class Variance Authority)로 컴포넌트 변형 관리
- Skeleton 로더를 별도로 export하여 Suspense와 함께 사용
- PC/Mobile 전용 컴포넌트가 필요한 경우 접미사로 구분 (예: `TableOfContentsPc`, `TableOfContentsMobile`)
- 공통 로직은 core 컴포넌트로 추출 (예: `table-of-contents-core.tsx`)
- 이미지 모달은 네이티브 `<dialog>` API 사용 (외부 라이브러리 없음)

### 스타일링

- Tailwind CSS 4 유틸리티 클래스 사용
- **px 단위, arbitrary value (`[...]`) 사용 금지** — Tailwind의 기본 spacing/sizing 토큰만 사용할 것. 필요한 커스텀 값은 `src/styles/tokens.css`에 디자인 토큰으로 정의하여 사용
- `cn()` 함수로 조건부 클래스 병합 (`clsx` + `tailwind-merge`)
- 커스텀 디자인 토큰은 `src/styles/tokens.css`에 정의
- 색상 시스템은 Flexoki 팔레트 기반 (`src/styles/theme.css`)
- 라이트/다크 모드는 CSS 변수로 관리, `next-themes`의 `ThemeProvider`로 전환

### 페이지 레이아웃 패턴

모든 목록형 페이지는 홈 페이지와 동일한 레이아웃 구조를 따름:

```tsx
<Shell className="flex flex-col">
  <div className="flex justify-evenly">
    <div className="flex max-w-2xl flex-1 flex-col lg:pr-6 lg:pt-2">
      {/* 콘텐츠 */}
    </div>
  </div>
</Shell>
```

### TypeScript

- strict 모드 활성화
- `import type`으로 타입 임포트 분리
- 경로 별칭: `@/*` → `./src/*`
- Zod로 런타임 검증 (폼 입력, 서버 액션)

### 데이터베이스

- Drizzle ORM으로 타입 안전한 쿼리 작성
- 스키마: `src/db/schema.ts` (comments, subscriptions 테이블)
- Neon 서버리스 PostgreSQL 사용
- DB 모듈은 `server-only`로 보호 — 클라이언트 번들에 절대 포함되지 않음
- 서버 액션(`"use server"`)에서 DB 조작 수행

### 성능 원칙

- **홈 페이지(`/`)는 PPR** — 정적 쉘(포스트 목록, 태그)은 빌드 타임에 생성되고, 최근 댓글은 `"use cache"` + `cacheLife("minutes")`로 서버에서 캐시
- 최근 댓글은 서버 컴포넌트(`RecentCommentList`)에서 DB 직접 쿼리 + Suspense fallback으로 스켈레톤 표시
- CLS 방지: 마운트 전 `null`을 반환하는 대신 동일 크기의 placeholder 렌더링
- `generateStaticParams`로 가능한 모든 경로를 빌드 타임에 정적 생성
- 프로덕션 빌드 시 `console.*` 자동 제거

## 환경 변수

- `DATABASE_URL`: Neon PostgreSQL 연결 문자열 (필수, 댓글/구독 기능에 사용)
- `DISCORD_WEBHOOK_URL`: 새 댓글 Discord 알림 (선택)
- `ANALYZE`: `"true"`로 설정 시 번들 분석기 활성화 (선택)

## 이미지

- 외부 이미지는 Cloudinary(`res.cloudinary.com`)에 호스팅
- `next.config.mjs`의 `remotePatterns`에 허용 도메인 등록 필요
- Next.js `<Image>` 컴포넌트로 최적화
- 포스트 내 이미지 클릭 시 `ImageLightbox`로 확대 (네이티브 dialog)
- OG 이미지는 사이트 전역 + 포스트별로 동적 생성 (`opengraph-image.tsx`)

## 코드 하이라이팅

- rehype-pretty-code + Shiki로 구문 강조
- 테마: Flexoki dark/light (`src/styles/flexoki-*-color-theme.json`)
- 라인 하이라이팅, 라인 넘버, 코드 블록 타이틀 지원
- 코드 블록 스타일은 `src/styles/code.css`에서 관리

## MDX 커스텀 컴포넌트

- `mdx-components.tsx`에서 MDX 요소를 커스텀 컴포넌트로 매핑
- 이미지 → `ImageLightbox` (클릭 확대)
- 기타 HTML 요소 커스터마이징 가능

## 커밋 메시지

- 한국어로 작성
- 접두사 사용: `feat:`, `fix:`, `chore:`, `refactor:` 등
- 제목 줄(첫 줄)은 간결하게 요약하고, 빈 줄 이후 본문에 변경 사항을 상세히 기술
- 본문에 포함할 내용:
  - **배경/동기**: 왜 이 변경이 필요한지 (문제 상황, 요구사항)
  - **변경 내역**: 구체적으로 무엇을 어떻게 변경했는지 (파일, 로직, 의존성 등)
  - **부수 효과/주의사항**: 이 변경으로 인해 달라지는 동작, 삭제된 기능, 마이그레이션 필요 여부 등
- 예:

```
feat: 댓글 닉네임/아바타를 localStorage에 저장하여 재방문 시 자동 복원

배경:
댓글 폼은 매번 랜덤 닉네임과 아바타를 생성하여, 재방문 사용자가 이전에
사용한 닉네임/아바타를 유지할 수 없었다.

변경 내역:
- 폼 제출 시 닉네임과 아바타 URL을 localStorage에 저장
- 마운트 시 저장된 값을 불러와 폼에 반영
- localStorage 키: comment-nickname, comment-avatar
```

## 커스텀 스킬 (`.claude/skills/`)

이 프로젝트에는 반복적인 작업을 자동화하는 커스텀 스킬이 포함되어 있습니다. 슬래시 명령어로 호출합니다:

| 명령어 | 설명 | 주요 사용 시점 |
|--------|------|---------------|
| `/new-post` | 새 블로그 포스트 MDX 스캐폴딩 | 새 글 작성 시작 시 |
| `/review-post` | 포스트 리뷰 (프론트매터, 맞춤법, SEO) | 발행 전 품질 검수 |
| `/check-style` | 스타일링 컨벤션 준수 검사 | UI 변경 후 |
| `/check-client-boundary` | 클라이언트 컴포넌트 경계 감사 | 컴포넌트 추가/변경 후 |

- 스킬 정의 파일은 `.claude/skills/{스킬명}/SKILL.md`에 위치
- 새 스킬을 추가하거나 기존 스킬을 수정할 때 이 목록도 함께 업데이트할 것

## 주의사항

- `.data/` 디렉토리는 빌드 시 자동 생성되므로 직접 수정하지 않음
- `public/search-index.json`도 빌드 시 자동 생성됨
- 콘텐츠 변경 후에는 `node scripts/generate-posts-data.js`를 실행하거나, `pnpm dev`로 자동 감지
- `server-only` 패키지로 서버 전용 코드가 클라이언트 번들에 포함되지 않도록 보호
- OG 이미지에서 폰트 로드 시 `readFile` + `process.cwd()` 패턴 사용 (Turbopack 호환, `fetch(new URL(...))` 사용 금지)
- macOS는 파일명 대소문자를 구분하지 않지만 Vercel(Linux)은 구분함 — 파일 참조 시 대소문자 정확히 일치시킬 것
