---
name: check-style
description: 프로젝트의 스타일링 컨벤션 준수 여부를 검사합니다. Tailwind arbitrary value, px 단위, 디자인 토큰 미사용, cn() 누락 등을 감지합니다. "/check-style", "스타일 검사", "디자인 토큰 체크" 등의 요청에 사용합니다.
---

# Flexoki + 디자인 토큰 준수 검사

이 스킬은 프로젝트의 스타일링 코드가 정해진 컨벤션을 따르고 있는지 검사합니다.

## 검사 대상

- 기본: `src/` 디렉토리 내 모든 `.tsx`, `.ts` 파일
- 인자로 특정 파일이나 디렉토리를 지정할 수 있음
- `src/styles/*.css` 파일은 토큰 정의 파일이므로 검사 제외

## 검사 규칙

### 규칙 1: Arbitrary Value 사용 금지 (심각도: ERROR)

Tailwind의 arbitrary value (`[...]`) 사용을 감지합니다.

**감지 패턴:**
- `w-[200px]`, `h-[50%]`, `p-[1.5rem]` 등 대괄호 안에 직접 값을 넣는 패턴
- `text-[14px]`, `text-[#ff0000]` 등 텍스트/색상 arbitrary value
- `bg-[var(--custom)]` 같은 CSS 변수 직접 참조 (tokens.css에 매핑해야 함)

**예외:**
- `group-[...]`, `peer-[...]` 등 상태 기반 선택자는 허용
- `data-[...]` 속성 선택자는 허용
- CSS 파일(`.css`) 내에서는 검사하지 않음

**수정 가이드:**
- 필요한 커스텀 값은 `src/styles/tokens.css`에 디자인 토큰으로 정의
- 예: `w-[200px]` → `tokens.css`에 `--size-sidebar: 200px` 정의 후 Tailwind 토큰으로 사용

### 규칙 2: px 단위 직접 사용 금지 (심각도: ERROR)

인라인 스타일이나 className에서 px 단위를 직접 사용하는 것을 감지합니다.

**감지 패턴:**
- `style={{ width: '200px' }}`, `style={{ fontSize: '14px' }}`
- `className` 안의 px 값 (규칙 1과 겹침)

**예외:**
- CSS 파일 내에서는 허용 (토큰 정의용)
- `border-width` 같은 1px 값은 Tailwind 기본 클래스 사용 (`border`)
- SVG 관련 속성 (viewBox 등)

### 규칙 3: cn() 미사용 감지 (심각도: WARN)

조건부 className을 문자열 연결이나 템플릿 리터럴로 처리하는 것을 감지합니다.

**감지 패턴:**
- `` className={`${base} ${condition ? 'a' : 'b'}`} ``
- `className={someVar + ' other-class'}`
- `className={condition ? 'class-a' : 'class-b'}`

**올바른 패턴:**
```tsx
import { cn } from "@/lib/utils";
className={cn("base-class", condition && "conditional-class")}
```

### 규칙 4: 하드코딩 색상 사용 금지 (심각도: ERROR)

Flexoki 디자인 시스템의 CSS 변수 대신 색상을 직접 하드코딩하는 것을 감지합니다.

**감지 패턴:**
- `text-red-500`, `bg-blue-200` 등 Tailwind 기본 색상 팔레트 사용
- `#ff0000`, `rgb(...)`, `hsl(...)` 등 직접 색상 값
- `text-gray-*`, `bg-slate-*` 등 Tailwind 기본 회색 계열

**허용 패턴:**
- `text-primary`, `bg-background`, `text-muted-foreground` 등 시맨틱 토큰
- `text-foreground`, `bg-card`, `border-border` 등 tokens.css에 정의된 색상
- `text-destructive` 등 의미 기반 색상명
- `src/styles/` 내 CSS 파일에서의 색상 정의

### 규칙 5: 라이트/다크 모드 대응 확인 (심각도: WARN)

새로 추가된 컴포넌트에 하드코딩된 색상이 있을 때, 다크 모드 대응 여부를 확인합니다.

**검사 내용:**
- `dark:` 변형 없이 배경/텍스트 색상을 직접 지정한 경우
- CSS 변수(`var(--...)`) 사용 시에는 `theme.css`에서 다크 모드 정의가 있는지 확인

## 출력 형식

```
## 스타일 검사 결과

### 요약
- 검사 파일 수: N개
- ERROR: N개
- WARN: N개
- PASS: N개

### 이슈 목록

#### ERROR
- `src/components/foo.tsx:15` — arbitrary value 사용: `w-[200px]`
  → `tokens.css`에 토큰 정의 후 사용하세요

#### WARN
- `src/components/bar.tsx:42` — cn() 미사용: 템플릿 리터럴로 조건부 클래스 처리
  → `cn()` 함수를 사용하세요
```

## 자동 수정

사용자 승인 시, 아래 항목은 자동 수정이 가능합니다:
- cn() 래핑 (문자열 조건부 → cn() 호출로 변환)
- Tailwind 기본 색상 → 시맨틱 토큰 매핑 (명확한 대응이 있는 경우)
