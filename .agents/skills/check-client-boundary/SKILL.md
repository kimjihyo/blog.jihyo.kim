---
name: check-client-boundary
description: 클라이언트 컴포넌트 경계를 감사합니다. 불필요한 "use client" 사용, 클라이언트 번들 비대화, 서버 컴포넌트로 내릴 수 있는 로직을 감지합니다. "/check-client-boundary", "클라이언트 경계 검사", "use client 체크" 등의 요청에 사용합니다.
---

# 클라이언트 컴포넌트 경계 감사

이 스킬은 프로젝트의 서버/클라이언트 컴포넌트 경계가 최적으로 설정되어 있는지 검사합니다.

## 핵심 원칙

이 프로젝트는 **서버 컴포넌트 우선** 정책을 따릅니다:
- `"use client"`는 인터랙션이 필요한 최소 단위의 리프 컴포넌트에만 적용
- 페이지나 레이아웃 단위로 `"use client"`를 선언하지 않음
- 클라이언트 번들 크기를 최소화

## 검사 절차

### 1단계: 현재 "use client" 파일 목록 수집

`src/` 디렉토리에서 `"use client"` 선언이 있는 모든 파일을 찾습니다.

### 2단계: 허용 목록 비교

CLAUDE.md에 기록된 허용 목록과 비교합니다:

**허용된 클라이언트 컴포넌트:**
- `comment-form.tsx` — 폼 상태, localStorage, 애니메이션
- `table-of-contents-pc.tsx` — IntersectionObserver
- `table-of-contents-mobile.tsx` — IntersectionObserver
- `search-client.tsx` — 클라이언트 사이드 검색
- `image-lightbox.tsx` — 이미지 확대 모달 (dialog API)
- `mode-switch.tsx` — 테마 토글 (next-themes)
- `ui/` 내 shadcn/ui 컴포넌트 (avatar, switch, label, image) — 라이브러리 요구사항

허용 목록에 없는 새로운 `"use client"` 파일이 있으면 플래그합니다.

### 3단계: 각 클라이언트 컴포넌트 분석

각 `"use client"` 컴포넌트에 대해 다음을 검사합니다:

#### 규칙 1: 클라이언트 선언 정당성 (심각도: ERROR)

`"use client"`가 정말 필요한지 확인합니다. 아래 중 하나 이상에 해당해야 합니다:
- `useState`, `useReducer` 등 React 상태 훅 사용
- `useEffect`, `useLayoutEffect` 등 이펙트 훅 사용
- `useRef`로 DOM 직접 조작
- `onClick`, `onChange`, `onSubmit` 등 이벤트 핸들러 사용
- `usePathname`, `useSearchParams`, `useRouter` 등 Next.js 클라이언트 훅 사용
- `useTheme` 등 클라이언트 전용 라이브러리 훅 사용
- `window`, `document`, `localStorage` 등 브라우저 API 사용

위 조건에 해당하지 않으면 서버 컴포넌트로 전환할 수 있습니다.

#### 규칙 2: 과도한 범위 (심각도: WARN)

클라이언트 컴포넌트가 불필요하게 큰 범위를 잡고 있는지 검사합니다:
- 파일이 100줄을 초과하면서 인터랙티브 로직이 일부에만 있는 경우
- 데이터 페칭 로직이 클라이언트 컴포넌트 안에 있는 경우
- 정적 UI 부분이 클라이언트 컴포넌트에 포함되어 있는 경우

**개선 제안:**
- 인터랙티브 부분만 별도 클라이언트 컴포넌트로 추출
- 정적 부분은 서버 컴포넌트로 분리하여 children으로 전달

#### 규칙 3: 서버로 내릴 수 있는 로직 (심각도: WARN)

클라이언트 컴포넌트 내에 서버에서 처리할 수 있는 로직이 있는지 검사합니다:
- 날짜 포맷팅, 문자열 가공 등 순수 연산
- 정적 데이터 변환
- 조건부 렌더링 중 서버에서 결정할 수 있는 부분

#### 규칙 4: 무거운 의존성 임포트 (심각도: WARN)

클라이언트 컴포넌트가 번들 크기에 영향이 큰 라이브러리를 임포트하는지 검사합니다:
- 큰 유틸리티 라이브러리 (lodash 전체 임포트 등)
- 서버에서만 필요한 모듈 (`drizzle-orm`, `server-only` 등)
- 트리 셰이킹이 안 되는 임포트 패턴

### 4단계: "use server" 파일 교차 확인

서버 액션 파일(`"use server"`)이 올바르게 분리되어 있는지 확인합니다:
- `_actions/` 디렉토리에 위치하는지
- 클라이언트 컴포넌트에서 직접 DB 쿼리를 하지 않는지

## 출력 형식

```
## 클라이언트 경계 감사 결과

### 현황
- 전체 컴포넌트 파일: N개
- "use client" 파일: N개 (비율: N%)
- 허용 목록 외 신규: N개

### 허용 목록 외 클라이언트 컴포넌트
(새로 추가된 것이 있으면 여기 표시)

| 파일 | 클라이언트 필요 사유 | 판정 |
|------|---------------------|------|
| `src/components/new-thing.tsx` | useState 사용 | 정당 / 범위 축소 권장 |

### 이슈 목록

#### ERROR
- `src/components/foo.tsx` — "use client" 불필요: 브라우저 API/훅 미사용

#### WARN
- `src/components/bar.tsx` — 과도한 범위: 120줄 중 인터랙티브 로직은 20줄
  → 인터랙티브 부분을 별도 컴포넌트로 추출 권장

### CLAUDE.md 업데이트 필요 여부
(신규 "use client" 파일이 정당한 경우, CLAUDE.md 허용 목록에 추가 필요)
```

## CLAUDE.md 자동 업데이트

정당한 새 `"use client"` 파일이 발견되면, 사용자 승인 후 CLAUDE.md의 클라이언트 컴포넌트 허용 목록을 자동으로 업데이트합니다.
