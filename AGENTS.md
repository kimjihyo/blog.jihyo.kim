# AGENTS.md

이 문서는 AI 에이전트가 이 프로젝트에서 작업할 때 참고해야 할 가이드입니다.

## 프로젝트 개요

개인 블로그 ([blog.jihyo.kim](https://blog.jihyo.kim)). MDX 기반의 정적 콘텐츠와 댓글 시스템을 위한 서버사이드 기능을 함께 갖춘 Next.js 애플리케이션입니다.

## 기술 스택

- **프레임워크**: Next.js 16 (App Router, Turbopack)
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
│   ├── generate-posts-data.js   # MDX → JSON 변환
│   └── watch-posts.js           # 개발 시 콘텐츠 변경 감지
├── drizzle/              # DB 마이그레이션 파일
├── public/               # 정적 에셋
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # 루트 레이아웃 (폰트, 테마, 메타데이터)
│   │   ├── sitemap.ts    # XML 사이트맵 생성
│   │   ├── manifest.ts   # PWA 매니페스트
│   │   ├── opengraph-image.tsx  # OG 이미지 동적 생성
│   │   └── (main-layout)/      # 헤더/푸터 공유 레이아웃 그룹
│   │       ├── (home)/          # 홈 페이지 (포스트 목록)
│   │       └── posts/[slug]/    # 개별 포스트 페이지
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
2. `.data/posts.json`과 `.data/tags.json`에 정적 데이터 생성
3. 앱에서는 JSON을 import하여 사용 (파일시스템 접근 불필요)
4. 개발 시 `scripts/watch-posts.js`가 콘텐츠 변경을 감지하여 자동 재생성

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
- `cn()` 함수로 조건부 클래스 병합 (`clsx` + `tailwind-merge`)
- 커스텀 디자인 토큰은 `src/styles/tokens.css`에 정의
- 라이트/다크 모드는 `src/styles/theme.css`의 CSS 변수로 관리 (OKLch 색공간)
- `next-themes`의 `ThemeProvider`로 테마 전환

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
- 예: `feat: 푸터와 포스트 페이지 스타일링 조정`

## 주의사항

- `.data/` 디렉토리는 빌드 시 자동 생성되므로 직접 수정하지 않음
- 콘텐츠 변경 후에는 `node scripts/generate-posts-data.js`를 실행하거나, `pnpm dev`로 자동 감지
- `server-only` 패키지로 서버 전용 코드가 클라이언트 번들에 포함되지 않도록 보호
- 프로덕션 빌드 시 `console.*` 자동 제거
