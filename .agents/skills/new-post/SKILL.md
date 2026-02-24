---
name: new-post
description: 새 블로그 포스트를 스캐폴딩합니다. 제목, 태그, 요약을 입력받아 MDX 파일을 생성하고 콘텐츠 빌드 스크립트를 실행합니다. "/new-post", "새 글 작성", "포스트 만들어줘" 등의 요청에 사용합니다.
---

# 새 블로그 포스트 스캐폴딩

이 스킬은 `/content` 디렉토리에 새 MDX 블로그 포스트 파일을 생성합니다.

## 실행 절차

### 1단계: 정보 수집

사용자에게 다음 정보를 AskUserQuestion으로 질문합니다:

**필수 항목:**
- **제목** (`title`): 포스트 제목
- **슬러그**: URL에 사용될 파일명 (미입력 시 제목 기반으로 kebab-case 자동 생성)
- **태그** (`tags`): 기존 태그 목록을 `.data/tags.json`에서 읽어 선택지로 제시. 새 태그 직접 입력도 가능
- **요약** (`summary`): 1~2문장 요약

**선택 항목 (기본값 제공):**
- **썸네일** (`thumbnail`): Cloudinary URL. 미입력 시 빈 문자열
- **타입** (`type`): `dev-log`, `trouble-shooting` 등. 미입력 시 생략
- **생성일** (`createdTime`): 미입력 시 현재 시각(UTC, ISO 8601)

### 2단계: 기존 태그 목록 조회

`.data/tags.json` 파일을 읽어 현재 사용 중인 태그 목록을 파악합니다.
태그 선택 시 이 목록을 보여주어 일관성을 유지합니다.

### 3단계: MDX 파일 생성

`/content/{slug}.mdx` 파일을 아래 형식으로 생성합니다:

```mdx
---
title: "{제목}"
tags: ["{태그1}", "{태그2}"]
createdTime: "{ISO 8601 UTC}"
updatedTime: "{ISO 8601 UTC (생성일과 동일)}"
thumbnail: "{Cloudinary URL 또는 빈 문자열}"
summary: "{요약}"
---

{여기에 글을 작성하세요}
```

**주의:**
- `createdTime`과 `updatedTime`은 동일한 값으로 설정 (신규 포스트)
- 시간 형식: `"2025-01-01T00:00:00Z"` (UTC, 시분초는 00:00:00)
- 슬러그는 영문 kebab-case (예: `my-first-post.mdx`)
- 이미 같은 슬러그의 파일이 존재하면 사용자에게 경고

### 4단계: 콘텐츠 빌드 실행

파일 생성 후 `node scripts/generate-posts-data.js`를 실행하여:
- `.data/posts.json`, `.data/tags.json` 갱신
- `public/search-index.json` 갱신

### 5단계: 결과 보고

- 생성된 파일 경로
- 포스트 URL 미리보기: `https://blog.jihyo.kim/posts/{slug}`
- 적용된 태그 목록
- `pnpm dev` 실행 중이면 자동 반영됨을 안내
