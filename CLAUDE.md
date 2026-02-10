# AGENTS.md

이 문서는 AI 에이전트가 이 프로젝트에서 작업할 때 참고해야 할 가이드입니다.

## 프로젝트 개요

개인 블로그 ([blog.jihyo.kim](https://blog.jihyo.kim)). MDX 기반의 정적 콘텐츠와 댓글 시스템을 위한 서버사이드 기능을 함께 갖춘 Next.js 애플리케이션입니다. 홈 페이지는 PPR(Partial Prerendering)로 동작하여 정적 쉘은 즉시 서빙하고, 최근 댓글은 `"use cache"`로 캐시합니다.

## 기술 스택

- **프레임워크**: Next.js 16 (App Router, Turbopack, `cacheComponents: true`)
- **언어**: TypeScript (strict mode)
- **스타일링**: Tailwind CSS 4 + shadcn/ui (Radix UI 기반)
- **콘텐츠**: MDX (remark/rehype 플러그인 체인)
- **데이터베이스**: Neon PostgreSQL + Drizzle ORM
- **패키지 매니저**: pnpm
- **배포**: Vercel
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
│   │   ├── layout.tsx    # 루트 레이아웃 (폰트, 테마, 메타데이터)
│   │   ├── sitemap.ts    # XML 사이트맵 생성
│   │   ├── manifest.ts   # PWA 매니페스트
│   │   ├── opengraph-image.tsx  # OG 이미지 동적 생성
│   │   └── (main-layout)/      # 헤더/푸터 공유 레이아웃 그룹
│   │       ├── (home)/          # 홈 페이지 (PPR, 최신 8개 포스트 + 최근 댓글 cache)
│   │       ├── posts/[slug]/    # 개별 포스트 페이지
│   │       ├── tags/            # 태그 목록 페이지 (SSG)
│   │       │   └── [tag]/[page]/ # 태그별 페이지네이션 (SSG)
│   │       └── search/          # 검색 페이지 (클라이언트 검색)
│   ├── components/
│   │   ├── ui/           # shadcn/ui 기반 공용 컴포넌트
│   │   ├── layouts/      # 헤더, 푸터, 테마 토글
│   │   └── shell.tsx     # 컨테이너 래퍼
│   ├── config/site.ts    # 사이트 설정 (이름, URL, 링크)
│   ├── db/               # Drizzle ORM 스키마 및 연결
│   ├── lib/utils.ts      # cn(), formatDate() 유틸리티
│   ├── styles/           # CSS 파일 (tokens, theme, prose, code 등)
│   └── assets/fonts/     # Pretendard 가변 폰트
└── next.config.mjs       # Next.js + MDX + 번들 분석기 설정
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

- **`/tags/all/1`**: 모든 포스트를 보여주는 전체 목록
- **`/tags/{태그명}/1`**: 특정 태그로 필터링된 포스트 목록
- 모든 태그/페이지 조합은 `generateStaticParams`로 빌드 타임에 정적 생성

## 주요 명령어

```bash
pnpm dev          # 개발 서버 (콘텐츠 워처 + Turbopack)
pnpm build        # 프로덕션 빌드 (prebuild로 콘텐츠 JSON 자동 생성)
pnpm lint         # ESLint 실행
pnpm test         # Vitest 테스트 실행
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

## 코딩 컨벤션

### 파일/디렉토리 네이밍

- `_components/`, `_actions/`, `_utils/`: 해당 라우트 전용 내부 모듈 (접두사 `_`)
- `(group-name)/`: Next.js 라우트 그룹 (URL에 영향 없음)
- 컴포넌트 파일: kebab-case (예: `site-header.tsx`, `post-list-item.tsx`)
- 타입/인터페이스: PascalCase (예: `BlogPost`, `Frontmatter`)

### 컴포넌트 패턴

- **Server Component가 기본**. 인터랙티브한 경우에만 `"use client"` 사용
- shadcn/ui 컴포넌트는 `src/components/ui/`에 위치
- CVA(Class Variance Authority)로 컴포넌트 변형 관리
- Skeleton 로더를 별도로 export하여 Suspense와 함께 사용
- PC/Mobile 전용 컴포넌트가 필요한 경우 접미사로 구분 (예: `TableOfContentsPc`, `TableOfContentsMobile`)

### 스타일링

- Tailwind CSS 4 유틸리티 클래스 사용
- **px 단위, arbitrary value (`[...]`) 사용 금지** — Tailwind의 기본 spacing/sizing 토큰만 사용할 것. 필요한 커스텀 값은 `src/styles/tokens.css`에 디자인 토큰으로 정의하여 사용
- `cn()` 함수로 조건부 클래스 병합 (`clsx` + `tailwind-merge`)
- 커스텀 디자인 토큰은 `src/styles/tokens.css`에 정의
- 라이트/다크 모드는 `src/styles/theme.css`의 CSS 변수로 관리 (OKLch 색공간)
- `next-themes`의 `ThemeProvider`로 테마 전환

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
- Zod로 런타임 검증 (폼 입력 등)

### 데이터베이스

- Drizzle ORM으로 타입 안전한 쿼리 작성
- 스키마: `src/db/schema.ts` (comments, subscriptions 테이블)
- Neon 서버리스 PostgreSQL 사용
- 서버 액션에서 DB 조작 수행

### 성능 원칙

- **홈 페이지(`/`)는 PPR** — 정적 쉘(포스트 목록, 태그)은 빌드 타임에 생성되고, 최근 댓글은 `"use cache"` + `cacheLife("minutes")`로 서버에서 캐시
- 최근 댓글은 서버 컴포넌트(`RecentCommentList`)에서 DB 직접 쿼리 + Suspense fallback으로 스켈레톤 표시
- CLS 방지: 마운트 전 `null`을 반환하는 대신 동일 크기의 placeholder 렌더링
- `generateStaticParams`로 가능한 모든 경로를 빌드 타임에 정적 생성

## 환경 변수

- `DATABASE_URL`: Neon PostgreSQL 연결 문자열 (필수, 댓글/구독 기능에 사용)
- `ANALYZE`: `"true"`로 설정 시 번들 분석기 활성화 (선택)

## 이미지

- 외부 이미지는 Cloudinary(`res.cloudinary.com`)에 호스팅
- `next.config.mjs`의 `remotePatterns`에 허용 도메인 등록 필요
- Next.js `<Image>` 컴포넌트로 최적화

## 코드 하이라이팅

- rehype-pretty-code + Shiki로 구문 강조
- 테마: `github-dark` (다크모드), `github-light` (라이트모드)
- 라인 하이라이팅, 라인 넘버, 코드 블록 타이틀 지원

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

## 주의사항

- `.data/` 디렉토리는 빌드 시 자동 생성되므로 직접 수정하지 않음
- `public/search-index.json`도 빌드 시 자동 생성됨
- 콘텐츠 변경 후에는 `node scripts/generate-posts-data.js`를 실행하거나, `pnpm dev`로 자동 감지
- `server-only` 패키지로 서버 전용 코드가 클라이언트 번들에 포함되지 않도록 보호
- 프로덕션 빌드 시 `console.*` 자동 제거
