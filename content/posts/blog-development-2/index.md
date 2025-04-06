---
tags: ["Blog", "Web"]
createdTime: "2025-04-06T00:00:00Z"
thumbnail: "https://res.cloudinary.com/dab33vdij/image/upload/v1743601308/IMG_0410_pv8gij.webp"
summary: "이번 글에서는 제가 이 블로그 프로젝트에서 어떤 스타일링 라이브러리와 UI 컴포넌트 라이브러리를 사용했는지 소개하고 어떻게 세팅해 주었는지 보여드리겠습니다."
updatedTime: "2025-04-06T00:00:00Z"
type: "post"
title: "블로그 개발 - UI 라이브러리와 스타일링 선택하기"
---

## 서론: UI와 스타일링의 중요성

Next.js 프로젝트에서 어떤 스타일링 방식을 사용하고 어떤 UI 컴포넌트 라이브러리를 사용하는지는 전체 개발 경험과 유지 보수성에 큰 영향을 줍니다.

UI 컴포넌트 라이브러리 같은 경우에는 사용 안 해도 되지만, 이 블로그 프로젝트에는 개발자인 저 하나만 개발을 하고 있기 있습니다. 디자인에 큰 신경을 쓰지 않기 위해서 저는 이미 잘 만들어진 UI 컴포넌트 라이브러리를 사용하기로 했습니다.

이번 글에서는 제가 이 블로그 프로젝트에서 어떤 스타일링 라이브러리와 UI 컴포넌트 라이브러리를 사용했는지 소개하고 어떻게 세팅해 주었는지 보여드리겠습니다.

## 후보군 선정: 어떤 옵션들이 있었나

UI 컴포넌트 라이브러리를 선택하기 전에 스타일링 방식을 정해야합니다. UI 컴포넌트 라이브러리에서 스타일링 방식을 보통 강제하는 경우가 많기 때문입니다. 저는 아래왜 같은 후보군으로 추릴 수 있었습니다.

### 스타일링 라이브러리 후보

- CSS Modules: 별다른 설정없이 바로 Next.js와의 기본 통합성
- styled-components / emotion: CSS-in-JS, 컴포넌트 기반 스타일링
- TailwindCSS: Utility first styling 으로 빠른 UI 구성 가능

지난 글에서 다양한 CSS 스타일링 방법에 대해서 소개했습니다. - [정말 다양하고도 다양한 CSS를 사용하는 법](https://blog.jihyo.kim/posts/styling-solutions) 각 스타일링 방법에 대해서 조금 더 디테일한 내용이 궁금하면 해당 글을 읽어보시죠.

#### CSS Modules

우선 CSS Modules 입니다. 별다른 세팅 없이 바로 사용해볼 수 있지만 그 만큼 제가 UI 구성 / 스타일링 면에서 해야할 일이 많아집니다. 심지어 요즘에는 `create-next-app`이 바로 TailwindCSS를 기본적으로 설치할지 말지 물어봅니다. 저는 따라서 CSS Modules가 크게 매력적으로 다가오지 않았습니다.

#### CSS-in-JS

한때 엄청 핫했던 CSS-in-JS는 요즘 확실히 전보다 덜 쓰이는 분위기가 있습니다. 그 이유부터 좀 알아보겠습니다.

**런타임 성능 문제**

CSS-in-JS는 대부분 스타일을 런타임에서 생성합니다. 그러다 보니 페이지가 로딩될 때마다 스타일을 JS로 계산해서 DOM에 주입하게 되고 그 만큼 퍼포먼스에 부담, 특히 모바일, 저사양 기기에서 렌더링 지연 이슈가 있습니다.
TailwindCSS 나 일반 CSS는 정적 CSS 파일로 컴파일 되니까, 초기 렌더가 훨씬 빠릅니다.

**빌드 타임 최적화 어려움**

TailwindCSS는 `CSS Purge` 덕분에 빌드 타임에 최적화된 CSS만 추출할 수 있는데, CSS-in-JS는 대부분 런타임 스타일 생성이라 이런 정적 분석이 어렵거나 불가능 합니다. 결과적으로 성능 측면에서 불리 합니다.

**번글 크기 증가**

CSS-in-JS는 스타일도 JS 코드로 취급되기 때문에 JS 번들 사이즈가 커집니다. 특히 styled-components는 기본 런타임 크기부터 제법 큰 편에 속합니다. -> Lighthous 점수 에 악영향을 줄 수 있겠죠.

**서버 컴포넌트와의 궁합 문제**

Next.js 13+에서 본격적으로 도입된 Server Components 환경에서는 런타임에 스타일을 생성하는 방식이 문제가 됩니다. styled-components / emotion은 클라이언트 컴포넌트에서만 동작 가능하거나 별도의 세팅이 필요합니다. 당연히 TailwindCSS 는 순수 CSS 클래스이므로 어디서든 잘 동작합니다.

**생산성**

처음에는 CSS-in-JS가 컴포넌트 단위로 스타일을 캡슐화! 라는 개념으로 많은 인기를 끌었으나, TailwindCSS는 그걸 훨씬 더 단순하고 빠르게 구현할 수 있습니다.

```tsx
// CSS-in-JS
const Button = styled.button`
  padding: 8px 16px;
  background-color: #333;
`

// Tailwind
<button className="px-4 py-2 bg-gray-800">버튼</button>
```

사이드 프로젝트나 소규모 팀에서는 TailwindCSS를 사용하는게 개발하는데 있어서 훨씬 더 빠릅니다.

#### TailwindCSS <- 이걸로 결정!

제가 CSS-in-JS를 신나게 깐 것 같습니다. 반면 TailwindCSS는 위에서 언급한 문제점들을 해결해줍니다. 특히 Next.js와 궁합이 너무 잘 맞는데요. Next.js는 SSR/SSG에 강한 프레임워크 인데, Tailwind는 정적 분석 기반의 CSS Purge가 잘 되어 있어서 실제로 쓰는 클래만 CSS로 추출되서 번들 사이즈도 작습니다. 순수 CSS라 서버 컴포넌트와도 너무 잘 어울리구요.

그러한 이유로 요즘에는 Next.js + TailwindCSS의 조합은 거의 공식처럼 굳어졌습니다.

또 요즘 나오는 컴포넌트 라이브러리들이 다 Tailwind 기반이라 확장하기도 쉽습니다. 또 워낙 유명하고 많이 사용되는 라이브러리라 문서와 커뮤니티가 정말 훌륭합니다. 공식 문서는 엄청 자세하고 친절할 뿐더러 예제도 풍부합니다.

### UI 컴포넌트 라이브러리 정하기

TailwindCSS를 사용하기로 마음을 먹었으니 이제 어떤 UI 컴포넌트 라이브러리를 사용할지 고민해볼 시간 입니다. TailwindCSS 기반의 UI 컴포넌트 라이브러리는 가장 유명한 두 개를 비교해보고 고민해보겠습니다.

#### Headless UI

Tailwind 팀이 만든 accessbility 걱정안해도 되는 기능과 로직만 제공하는 UI 라이브러리 입니다. 아무래도 Tailwind 팀이 만들었다보니 Tailwind 와 너무 잘 어울리죠. 하지만 스타일이 전혀 없다는 단점이 있습니다. 기능은 다 짜여 있고 디자인은 너가 TailwindCSS로 알아서 해~ 라는 느낌... 빠르게 개발하고 싶은 저에게는 맞지 않는 옵션인 것 같습니다.

#### shadcn/ui

Headless UI 같은 accessibility를 걱정안해도 되고 컴포넌트의 로직만 사용할 수 있게 도와주는 Radix UI 기반의 shadcn/ui 입니다. Headless UI 와 달리 스타일리은 이쁘게 이미 다 되어 있고 Tailwind로 커스터마이징이 정말 쉽게 가능합니다.
제가 정말 매력적이다라고 느낀 부분은 컴포넌트를 필요한 만큼만 설치할 수 있다라는 점!
예를 들어 shadcn/ui의 버튼을 사용하고 싶으면 아래 커맨드를 실행하면 됩니다.

```bash
pnpm dlx shadcn-ui@latest add button
```

이렇게 하면 `components/ui/button.tsx` 같은 식으로 실제 컴포넌트 소스 코드가 추가되는 방식이고 필요하면 자유롭게 수정 가능합니다.

기본 스타일도 굉장히 모던하고 심플해서 이쁩니다. 따라서 저는 shadcn/ui를 사용하기로 결정하였습니다.

## 세팅하기

`create-next-app`을 하면 TailwindCSS를 설치할지 안할지 물어봅니다. 저는 그때 다 같이 설치해서 별도로 따로 설치는 안했습니다. 이 프로젝트에는 TailwindCSS v4가 설치가 됐습니다. TailwindCSS 같은 경우 v3 -> v4로 넘어오면서 굉장히 많은 것들이 변했습니다. 예를 들어 tailwind css 설정 파일인 `tailwind.config.js`는 사라졌습니다. 대신 CSS 파일 내에서 직접 설정을 정의하는 방식으로 변경됐습니다.

저는 `src/styles/globals.css` 파일을 만들고 tailwindcss 설정을 해주었습니다.

```css
@import "tailwindcss";
```

이렇게 하면 기본 TailwindCSS 설정은 끝납니다. 정말 간단해졌습니다. 예전에는 `tailwind.config.js`에서 `content` array에서 어떤 파일들이 TailwindCSS 클래스들을 사용하고 있는지 알려주었습니다. 이는 위에서 설명한 CSS Purge를 해 빌드 파일 최적화를 위해서 였는데요. v4로 넘어오면서 따로 설정해주지 않아도 자동으로 탐지해서 css purge를 해준다고 합니다. [이 글](https://tailwindcss.com/blog/tailwindcss-v4#automatic-content-detection)을 참고해 보세요.

다음으로 shadcn/ui를 설치하고 세팅 해보겠습니다.

```bash
pnpm dlx shadcn-ui@latest init
```

프롬프트에 적절하게 대답해주고 나면 알아서 세팅이 완료됩니다. 저는 프리텐다드 폰트를 사용할거고 제가 원하는 컬러 팔레트가 있기 때문에 `src/styles/globals.css`에 몇줄을 조금 더 추가해 주었습니다.

```css
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css");
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme {
  --font-pretendard: "Pretendard Variable", Pretendard;
  --color-gray-50: #f9fafb;
  --color-gray-100: #f2f4f6;
  --color-gray-200: #e5e8eb;
  --color-gray-300: #d1d6db;
  --color-gray-400: #b0b8c1;
  --color-gray-500: #8b95a1;
  --color-gray-600: #6b7684;
  --color-gray-700: #4e5968;
  --color-gray-800: #333d4b;
  --color-gray-900: #191f28;

  --color-blue-50: #e8f3ff;
  --color-blue-100: #c9e2ff;
  --color-blue-200: #90c2ff;
  --color-blue-300: #64a8ff;
  --color-blue-400: #4593fc;
  --color-blue-500: #3182f6;
  --color-blue-600: #2272eb;
  --color-blue-700: #1b64da;
  --color-blue-800: #1957c2;
  --color-blue-900: #194aa6;
}
...
```

## 마무리

어떤 라이브러리가 정답이다 이런 건 없습니다. 각 라이브러리 마다 장단점이 있는 것이고 프로젝트들 마다 잘 어울리는 궁합이 있는 것 같습니다. 현재 제가 사용하는 조합은 개인 블로그나 사이드 프로젝트에 정말 잘 맞는 것 같습니다. 다음 글에서는 포스트를 마크다운으로 작성하고 렌더링하는 방식에 대해 다뤄볼 예정입니다.

두서 없는 글 읽어주셔서 감사합니다.
