# ADR-001: SSG 리팩터링 — LCP/CLS 성능 최적화

- **상태**: 완료
- **날짜**: 2025-06-15
- **영향 범위**: 홈 페이지, 라우팅 구조, 검색, 태그 시스템, 사이트맵

## 배경 (Context)

홈 페이지(`/`)가 `searchParams`(태그 필터링, 페이지네이션)와 `RecentCommentList`(DB 쿼리) 의존성으로 인해 동적 페이지로 렌더되고 있었다. `cacheComponents: true`(PPR)가 활성화된 상태에서, 포스트 제목/요약 같은 LCP 대상 텍스트가 동적 RSC 영역에 위치하여 **LCP가 2.1초**로 악화. 또한 `ModeSwitch` 컴포넌트가 마운트 전 `null`을 반환하면서 **CLS ~0.011** 발생.

## 결정 (Decision)

홈 페이지를 **완전 SSG(Static Site Generation)** 로 전환하고, 동적 데이터(댓글)는 클라이언트 fetch 패턴으로 분리. CLS 유발 요소를 플레이스홀더로 교체.

## 변경 사항

### 1. 홈 페이지 SSG 전환

**파일**: `src/app/(main-layout)/(home)/page.tsx`

- `searchParams` 의존성 제거 — `async function Page({searchParams})` → 동기 `function Page()`
- `getBlogPosts().slice(0, 8)`로 최신 8개 포스트를 빌드 타임에 직접 렌더
- `<React.Suspense><PostPaginatedList>` → `PostListItem` 직접 map (Suspense 불필요)
- 인터랙티브 `TagList` → `Badge` + `<Link href="/tags/{name}/1">` 정적 링크로 교체
- 하단에 "전체 글 보기 →" 링크 (`/tags/all/1`)

**삭제된 파일**:
- `src/app/(main-layout)/(home)/_components/tag-list.tsx` — 인터랙티브 태그 필터 (SSG 불가)
- `src/app/(main-layout)/(home)/_components/post-paginiated-list.tsx` — searchParams 기반 페이지네이션

### 2. 최근 댓글 Cache Component 전환

~~처음에는 홈을 SSG로 만들기 위해 DB 쿼리를 클라이언트 fetch(`/api/recent-comments`)로 분리했으나,~~ `cacheComponents: true`가 활성화된 상태에서 `"use cache"` 디렉티브를 사용하면 서버 컴포넌트로 되돌리면서도 PPR을 통해 정적 쉘은 유지할 수 있다.

**수정 파일**: `src/app/(main-layout)/(home)/_components/recent-comment-list.tsx`
- `"use client"` + `useEffect` + `fetch` → `"use cache"` + `cacheLife("minutes")` 서버 컴포넌트로 전환
- DB 직접 쿼리 (`db`, `commentsTable`, `desc`)
- 내부에서 `Suspense` + `RecentCommentListSkeleton` fallback 처리

**수정 파일**: `src/app/(main-layout)/(home)/_components/recent-comment-list-item.tsx`
- `"use client"` 제거 (인터랙티브 기능 없음, 서버 컴포넌트로 전환)

**삭제 파일**: `src/app/api/recent-comments/route.ts`
- 클라이언트 fetch 불필요로 API 라우트 삭제

### 3. 라우팅 구조 통합 — `/tags/[tag]/[page]`

처음에는 `/posts/page/[page]` (전체 포스트 페이지네이션)와 `/tags/[tag]` (태그별 목록)을 별도 라우트로 생성했으나, 사용자 피드백으로 **하나의 라우트에 통합**.

**최종 라우트**: `src/app/(main-layout)/tags/[tag]/[page]/page.tsx`

- `tag === "all"`: 모든 포스트 표시
- `tag === "{태그명}"`: 해당 태그 포스트만 필터링
- 상단에 태그 네비게이션 바 (전체 + 개별 태그), 현재 태그 `variant="primary"` 하이라이트
- `generateStaticParams`로 모든 태그×페이지 조합 빌드 타임 정적 생성
- 페이지네이션: 8개/페이지, 기존 `Pagination` 컴포넌트 재사용

**삭제된 파일**:
- `src/app/(main-layout)/posts/page/[page]/page.tsx` — 통합으로 불필요

### 4. 태그 목록 페이지

**파일**: `src/app/(main-layout)/tags/page.tsx`

- 카드 형태로 태그 표시: 태그명, 포스트 수, 최대 3개 포스트 제목 미리보기
- 각 카드가 `/tags/{name}/1`로 링크
- 초기 디자인이 "너무 비어보인다"는 피드백으로 카드+미리보기 형태로 보강

### 5. 검색 페이지

**파일**:
- `src/app/(main-layout)/search/page.tsx` — 메타데이터 + 클라이언트 컴포넌트 렌더
- `src/app/(main-layout)/search/_components/search-client.tsx` — 클라이언트 검색

**구현 방식**:
- 빌드 시 `public/search-index.json` 생성 (`scripts/generate-posts-data.js` 확장)
- 검색 인덱스: `{ slug, title, summary, tags }[]`
- 클라이언트에서 fetch → 제목/요약/태그 필터링
- **기본 상태에서 전체 포스트 표시** (빈 화면 방지)
- 검색 아이콘, 결과 수 표시, 스켈레톤 로딩

### 6. CLS 수정 — ModeSwitch

**파일**: `src/components/layouts/mode-switch.tsx`

```diff
- if (!mounted) return null;
+ if (!mounted) return <div className="h-6 w-10" aria-hidden />;
```

Switch 컴포넌트의 실제 크기(`h-6 w-10`)와 동일한 플레이스홀더로 레이아웃 시프트 방지.

### 7. 사이트맵 업데이트

**파일**: `src/app/sitemap.ts`

- `/tags` 정적 라우트 추가
- `/tags/all/[page]` 페이지네이션 라우트
- `/tags/[tag]/[page]` 태그별 페이지네이션 라우트
- `/search` 정적 라우트

### 8. 빌드 스크립트 확장

**파일**: `scripts/generate-posts-data.js`

- 기존 `.data/posts.json`, `.data/tags.json` 생성 외에 `public/search-index.json` 추가 생성
- 검색 인덱스는 경량 구조: `{ slug, title, summary, tags }[]`

## 최종 라우팅 구조

| 라우트 | 렌더링 | 설명 |
|--------|--------|------|
| `/` | PPR | 최신 8개 포스트 + 사이드바(태그 링크, 최근 댓글 cache component) |
| `/tags` | SSG | 태그 목록 (카드+미리보기) |
| `/tags/all/[page]` | SSG | 전체 포스트 페이지네이션 |
| `/tags/[tag]/[page]` | SSG | 태그별 포스트 페이지네이션 |
| `/search` | SSG | 클라이언트 사이드 검색 |
| `/posts/[slug]` | PPR | 개별 포스트 (기존 유지) |

## 파일 변경 요약

| 작업 | 파일 |
|------|------|
| 수정 | `scripts/generate-posts-data.js` |
| 재작성 | `src/app/(main-layout)/(home)/page.tsx` |
| 재작성 | `src/app/(main-layout)/(home)/_components/recent-comment-list.tsx` (cache component) |
| 수정 | `src/app/(main-layout)/(home)/_components/recent-comment-list-item.tsx` (use client 제거) |
| 생성 | `src/app/(main-layout)/tags/page.tsx` |
| 생성 | `src/app/(main-layout)/tags/[tag]/[page]/page.tsx` |
| 생성 | `src/app/(main-layout)/search/page.tsx` |
| 생성 | `src/app/(main-layout)/search/_components/search-client.tsx` |
| 수정 | `src/components/layouts/mode-switch.tsx` |
| 수정 | `src/app/sitemap.ts` |
| 삭제 | `src/app/(main-layout)/(home)/_components/tag-list.tsx` |
| 삭제 | `src/app/(main-layout)/(home)/_components/post-paginiated-list.tsx` |
| 삭제 | `src/app/(main-layout)/posts/page/[page]/page.tsx` |

변경 없이 재사용: `post-list-item.tsx`, `pagination.tsx`, `posts/utils.ts`, `shell.tsx`

## 레이아웃 패턴

모든 목록형 페이지는 동일한 레이아웃 구조를 사용:

```tsx
<Shell className="flex flex-col">
  <div className="flex justify-evenly">
    <div className="flex max-w-2xl flex-1 flex-col lg:pr-6 lg:pt-2">
      {/* 콘텐츠 */}
    </div>
  </div>
</Shell>
```

초기 구현 시 일부 페이지에서 다른 컨테이너 패턴(`mx-auto max-w-2xl` 등)을 사용해 레이아웃이 어긋났으나, 피드백을 받아 위 패턴으로 통일.

## 디자인 결정 참고

- **태그 페이지**: 처음에는 Badge 리스트만 나열 → "비어보인다"는 피드백 → 카드+포스트 미리보기로 변경
- **검색 페이지**: 처음에는 입력 전 빈 화면 → 피드백 → 기본적으로 전체 포스트 표시, 입력하면 필터링
- **라우트 구조**: `/posts/page/[page]` + `/tags/[tag]` 분리 → 피드백 → `/tags/[tag]/[page]` 통합 (`all`은 전체 포스트)

## 검증 결과

- `pnpm build` 성공: 52개 정적 페이지 생성
- 홈 페이지 `○ Static`으로 표시 (SSG 확인)
- 모든 태그×페이지 조합 정적 생성 확인

## 관련 문서

- `CLAUDE.md` — 이 변경을 반영하여 라우팅 구조, 성능 원칙, 레이아웃 패턴 업데이트 완료
