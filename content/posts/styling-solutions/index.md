---
tags: ["CSS", "Web"]
createdTime: "2025-04-03T00:00:00.000+09:00"
thumbnail: "https://res.cloudinary.com/dab33vdij/image/upload/v1743593448/IMG_0408_ewhspi.png"
summary: "블로그 개발하기 두번째 글을 작성하려고 했습니다. 두번쨰 글은 제가 사용한 스타일링 라이브러리와 UI Components 라이브러리를 소개하고 어떻게 설정하여 사용하고 있는지 간략하게 적어보려고 했는데 스타일링 라이브러리에 관해서 적다가 글이 매우 길어져서 그냥 스타일링 라이브러리에 관한 내용만 담은 글을 작성했습니다. "
updatedTime: "2025-04-03T09:01:00.000Z"
type: "post"
title: "정말 다양하고도 다양한 CSS를 사용하는 법"
---

## 시작

블로그 개발하기 두번째 글을 작성하려고 했습니다. 두번쨰 글은 제가 사용한 스타일링 라이브러리와 UI Components 라이브러리를 소개하고 어떻게 설정하여 사용하고 있는지 간략하게 적어보려고 했는데 스타일링 라이브러리에 관해서 적다가 글이 매우 길어져서 그냥 스타일링 라이브러리에 관한 내용만 담은 글을 작성했습니다.

이번 글에서는 여러가지 스타일링 관리 방법들을 소개하고 각 방법들에서 사용되는 유명한 라이브러리들을 간략하게 적어보겠습니다.

## Styling Library

CSS 라이브러리라고도 불립니다. 밋밋한 HTML을 꾸며주려면 CSS가 필요합니다. HTML이 처음 등장한 1991년에는 CSS가 없었습니다. 웹이 인기를 얻으면서 디자인에 대한 니즈도 증가하여 1996년에 CSS가 발표되었습니다. 너무 쉽고 간결하게 HTML을 꾸며줄 수 있지만 사이트가 점점 복잡해지고 동적인 스타일링에 대한 필요가 증가하면서 단순히 CSS만으로는 개발하기 쉽지 않아졌습니다. 이러한 배경으로 등장한 것이 CSS Module, CSS Preprocessor, CSS-in-JS, CSS Framework 입니다.

### CSS Modules

CSS Modules은 말 그대로 CSS를 모듈화 하여 사용하는 방식입니다. 프로젝트가 커지다보면 CSS의 class와 id가 의도치 않게 겹치는 경우가 발생합니다. CSS를 모듈화 해서 사용하면 CSS Modules 번들러 (e.g. Webpack or Vite)가 파일별로 자동으로 고유한 클래스네임을 만들어서 scope를 지역적으로 제한합니다.

#### 장점

- 클래스 이름 관리의 부담이 줄고 네이밍 규칙도 간소화
- 특정 프레임워크나 라이브러리에 국한되지 않아 모든 곳에 사용 가능
- 브라우저가 지원하는 모던 CSS 기능 모두 이용 가능

#### 단점

- 스타일이 파일별로 분산되어 있어 컴포넌트 간 스타일 재사용이 쉽지 않음
- 동적으로 스타일링을 생성해 낼 수 없음

Next.js 에서 별도의 설치나 설정 없이 바로 사용해볼 수 있습니다.

```tsx
/* MyButton.module.css */
.my-button {
	background-color: red;
	color: white;
	padding: 1rem;
	border: 1px solid black;
	border-radius: 0.5rem;
}

/* MyButton.tsx */
import styles from './MyButton.module.css';

function MyButton() {
	return (
		<button type="button" className={styles['my-button']}>
			My Button
		</button>
	);
}
```

### CSS Preprocessor

CSS Preprocessor는 CSS를 확장한 별도의 syntax를 해석하여 일반 CSS로 변환하는 과정을 거쳐 동작합니다. Webpack 이나 Vite에 CSS Preprocessor loader를 추가하여 일반 CSS로 컴파일됩니다.

#### CSS Preprocessor 종류

- Sass: 가장 있기 있는 전처리기, `.scss` 또는 `.sass` 확장자 사용
- LESS: Bootstrap에서 사용했었던 전처리기, `.less` 확장자 사용
- Stylus: 간결한 문법이 특징인 전처리기, `.styl` 확장자 사용

#### CSS Preprocessor의 기능

Sass를 예시로 CSS Preprocessor의 대표적인 기능들을 보여드리겠습니다.

변수의 예시 입니다. 색상, 폰트 크기, 마진 등의 값을 변수로 저장해서 사용할 수 있습니다.

```scss
$primary-color: #3498db;

body {
  background-color: $primary-color;
}
```

중첩(Nesting) 의 예시 입니다. CSS의 계층 구조를 그대로 유지하면서 스타일을 정의할 수 있습니다.

```scss
.nav {
  background: #222;
  ul {
    list-style: none;
    li {
      display: inline-block;
    }
  }
}
```

연산의 예시 입니다.

```scss
.container {
  width: 100% - 20px;
}
```

Import의 예시 입니다. 여러 개의 스타일 파일을 나누어 관리할 수 있습니다.

```scss
@import "header";
@import "footer";
```

CSS도 업데이트를 계속하면서 변수, 연산, import 등의 기능을 기본적으로 제공합니다.
CSS selectors들을 nesting 하는 것은 SCSS에서만 할 수 있기때문에 해당 기능은 개인적으로 정말 편리하다고 생각합니다.

### CSS-in-JS

CSS-in-JS는 단어 그대로 JavaScript 코드 안에서 CSS를 작성하는 방식을 말합니다. JavaScript 코드가 실행될 때, 동적으로 스타일이 생성되고 적용됩니다. 대표적인 CSS-in-JS 라이브러리들로 styled-components 와 emotion 이 있습니다. 두 라이브러리 다 컴포넌트별로 스타일이 캡슐화되어 관리됩니다.

#### CSS-in JS 예시 코드

styled-components를 사용하면 아래와 같이 CSS를 적용할 수 있습니다.

```jsx
import styled from "styled-components";

const Button = styled.button`
  background-color: ${(props) => (props.primary ? "#3498db" : "#95a5a6")};
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.primary ? "#2980b9" : "#7f8c8d")};
  }
`;

export default function App() {
  return (
    <div>
      <Button primary>Primary Button</Button>
      <Button>Secondary Button</Button>
    </div>
  );
}
```

#### CSS-in-JS 장점과 단점

장점으로는

- 컴포넌트 단위 스타일링, 스타일이 컴포넌트와 함께 정의되어 스타일 충돌 X
- 스타일을 쉽게 동적으로 변경 가능

단점으로는

- 런타임으로 스타일이 생성되기 때문에 기존 CSS보다 성능이 떨어질 수 있음

### CSS Framework

미리 정의된 CSS 클래스들을 조합해서 사용하는 방식입니다. 유명한 CSS Framework로 Bootstrap 과 TailwindCSS가 있습니다. TailwindCSS 같은 경우에는 PostCSS를 기반으로 동작합니다. PostCSS는 CSS Postprocessor로서 CSS Preprocessor 와 달리 CSS 문법을 확장하거나 변환하는 것이 아니라 이미 CSS로 작성된 파일을 처리합니다.

다시 TailwindCSS로 돌아와서, 일반 CSS나 Sass처럼 직접 스타일을 작성하는 게 아니라, HTML 요소에 유틸리니 클래스를 추가하는 방식으로 사용됩니다.

```jsx
<button className="bg-blue-500 text-white font-bold">Click me</button>
```

- `bg-blue-500` -> 배경색 적용
- `text-white` -> 폰트 색상 적용
- ...

이런식으로 CSS를 따로 작성하지 않고도 스타일을 적용할 수 있습니다.

#### CSS Framework 장단점

장점으로는

- CSS를 직접 작성할 필요 없이 유틸리티 클래스를 잘 조합하면 돼 빠른 개발 속도
- 반응형 디자인 편리 -> TailwindCSS 같은 경우 `sm:`, `md:` 로 쉽게 적용 가능

단점으로는

- CSS 클래스가 길어 짐
- 클래스 이름이 익숙해질 때 까지 찾아봐야 해서 러닝 커브가 있음

## 마무리

이렇게 CSS 다루는 방법을 알아봤습니다. 정말 다양합니다. 각 방식마다 장단점이 존재합니다.

- 컴포넌트 단위의 스타일 관리가 필요하다면 CSS Modules
- 변수, 중첩(Nesting), 믹스인 등의 기능이 필요하다면 Sass(Preprocessor)
- 스타일을 컴포넌트와 함께 관리하고 싶다면 CSS-in-JS(Styled Components, Emotion)
- 빠른 개발과 일관된 디자인을 원한다면 CSS Framework(Tailwind, Bootstrap)

어떤 방식을 선택하든, 중요한 것은 프로젝트에 맞는 최적의 스타일링 방법을 찾는 것 입니다. 최근에는 TailwindCSS의 사용이 지배적인 것 같습니다. 아무래도 `create-next-app`을 실행하면 TailwindCSS를 기본적으로 설치할지 안할지 고를 수도 있으니까 말이죠.

읽어주셔서 감사합니다.
