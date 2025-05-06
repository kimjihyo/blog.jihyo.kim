---
tags: ["개발 세팅"]
createdTime: "2025-05-06T00:00:00.000Z"
thumbnail: "https://res.cloudinary.com/dab33vdij/image/upload/v1746513050/IMG_0487_ttews9.png"
summary: "pnpm과 eslint-config-next 사용 시 발생하는 eslint-plugin-react-hooks 로딩 오류의 원인과 해결 방식을 명확하게 설명한다."
updatedTime: "2025-05-06T00:00:00.000Z"
type: "post"
title: "pnpm 사용 시 ESLint 플러그인을 찾지 못하는 오류 해결하기"
---

## 시작

이 내용은 Next.js 세팅하기 글에서 간략하게 다뤘던 부분이지만, `pnpm`을 사용하는 환경에서 자주 마주치는 문제인 만큼 별도의 글로 정리할 가치가 있다고 판단해 다시 다듬어 올린다. 특히 `eslint-config-next` 사용 시 발생하는 `eslint-plugin-react-hooks` 로딩 오류의 원인과 해결 방식을 명확하게 설명한다.

## 문제 상황

Next.js 프로젝트에 `eslint-config-next`를 사용하고 있고, VS Code에서 ESLint 확장(Extension)을 설치했음에도 불구하고 다음과 같은 오류가 발생할 수 있다:

```
[Error - ...] Failed to load plugin 'react-hooks' declared in 'eslint-config-next': Cannot find module 'eslint-plugin-react-hooks'
```

이 오류는 `eslint-config-next`가 내부적으로 사용하는 `eslint-plugin-react-hooks`를 로드하지 못해서 발생한다. 주로 `pnpm`을 사용하는 환경에서 나타나며, `npm`이나 `yarn`을 사용할 때는 문제 없이 작동한다.

## 원인 분석

ESLint는 `.eslintrc.js` 파일의 `plugins` 항목에 명시된 플러그인을 문자열로 받아들이고, 이를 내부적으로 `require()`를 통해 로드한다. 예를 들면 다음과 같다:

```js
plugins: ["jsdoc"];
```

이렇게 선언된 플러그인은 ESLint가 `node_modules`에서 직접 찾게 된다.

`npm`과 `yarn`은 패키지를 설치할 때 의존성을 루트 `node_modules`에 올려두는 hoisting 방식을 사용한다. 이 구조에서는 간접적으로 설치된 패키지도 루트에서 접근할 수 있기 때문에, ESLint가 플러그인을 쉽게 찾을 수 있다.

반면 `pnpm`은 패키지를 격리된 구조로 설치하고, 기본 설정에서는 간접 의존성(phantom dependency)에 대한 접근을 허용하지 않는다. `eslint-config-next`가 내부적으로 설치한 `eslint-plugin-react-hooks`는 루트에 존재하지 않기 때문에 ESLint가 이를 찾지 못하는 문제가 발생한다.

## 해결 방법

### 방법 1: `.npmrc` 설정으로 hoisting 패턴 지정하기

pnpm에서 특정 패키지를 강제로 루트 `node_modules`에 hoist하려면 `.npmrc` 파일에 다음과 같은 설정을 추가한다:

```ini
public-hoist-pattern=*eslint*
```

이 설정을 적용하면 이름에 `eslint`가 포함된 모든 패키지가 루트로 올라오게 되어, ESLint가 정상적으로 플러그인을 로드할 수 있게 된다. 설정을 반영하기 위해서는 다음 명령어로 패키지를 다시 설치해야 한다:

```bash
pnpm install
```

### 방법 2: 필요한 플러그인을 명시적으로 설치하기

다른 방법으로는 `eslint-plugin-react-hooks`를 프로젝트에 직접 설치하는 방식도 있다:

```bash
pnpm add -D eslint-plugin-react-hooks
```

이 방법은 일시적으로 문제를 해결할 수 있지만, 다른 ESLint 플러그인에서도 유사한 문제가 반복될 수 있으므로 장기적인 해결책으로는 적절하지 않다.

## 정상 동작 여부 확인 방법

- VS Code를 재시작하거나 ESLint 확장을 수동으로 재시작한다.
- `.js`, `.ts`, `.jsx`, `.tsx` 파일을 열었을 때 ESLint 경고나 오류가 정상적으로 표시되는지 확인한다.
- VS Code 하단의 ESLint 출력(Output) 탭에 더 이상 관련 오류가 표시되지 않는지 확인한다.
