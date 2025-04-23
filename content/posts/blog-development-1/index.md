---
tags: ["Blog", "Web"]
createdTime: "2025-04-02T00:00:00Z"
thumbnail: "https://res.cloudinary.com/dab33vdij/image/upload/v1744025393/IMG_0424_dugtl4.png"
summary: "지금 보고 계시는 블로그는 Next.js로 만들어졌습니다. 제가 Next.js로 블로그 프로젝트 초기 세팅했던 과정들을 적어봅니다."
updatedTime: "2025-04-02T00:00:00Z"
type: "post"
title: "블로그 개발 - Next.js 기본 세팅하기"
---

## 시작

개발을 하면서 새롭게 알게된 지식들을 저만 볼 수 있는 공간에 기록하곤 했습니다. 저의 빈약한 필력이 부끄러워 남에게 보여주지는 않았습니다. 지식을 학습하여 내 것으로 만들었다라고 말할 수 있으려면 그 지식을 남에게 쉽게 설명할 줄 알아야한다고 생각합니다. 그래서 저는 제가 개발하면서 새롭게 얻은 지식들을 블로그를 통해서 여러분께 설명해보려고 합니다. 지금까지는 컨텐츠를 소비하는 사람이였습니다. 이제 생산하는 사람이 되어보려고 합니다.

## 정적 콘텐츠 vs 동적 콘텐츠

이 두 개념의 차이는 콘텐츠를 생성하고 제공하는 방식에서 나타납니다.

### 정적 콘텐츠

정적 콘텐츠란 서버에 저장된 그대로 모든 사용자에게 동일하게 제공되는 파일을 의미합니다. 예를 들어 브라우저에서 웹페이지를 요청해서 받는 HTML, CSS, JavaScript, 그리고 이미지등이 정적 콘텐츠에 해당됩니다.

### 동적 콘텐츠

동적 콘텐츠란 사용자 요청에 따라 서버에서 실시간으로 생성되는 데이터를 의미합니다. 예를 들어 사용자별 정보, DB 데이터 등을 의미합니다.

### 정적 블로그로 개발

이 개념을 설명하는 이유는 지금 보고 계시는 이 블로그는 정적 블로그 입니다. 다시 말해, 블로그 컨텐츠가 미리 생성되어 서버에 저장되어 있고, 사용자 요청 시 서버에서 추가적인 처리 없이 저장된 파일을 그대로 제공합니다.

그러면 제가 어떻게 포스트를 작성해서 정적인 콘텐츠로 서빙할 수 있는지 궁금하실 수 있겠습니다.

저는 노션으로 글을 적고 → 스크립트로 노션 페이지를 마크다운으로 변환 → 생성된 마크다운을 포함하여 프로젝트를 새롭게 빌드 → 배포

이런 플로우로 포스트를 작성하고 있습니다. 이와 같은 정적 블로그에는 아래와 같은 장점이 있습니다.

- 서버에서 추가적인 처리 없이 콘텐츠를 제공하므로, 동적 블로그에 비해 로딩 속도가 빠릅니다.
- 서버 부하가 적어 안정적으로 블로그를 운영할 수 있습니다.
- 정적 HTML 파일로 구성되어 있어 검색 엔진이 콘텐츠를 쉽게 파악하고 인덱싱할 수 있습니다.

반면에 아래와 같은 단점도 존재합니다.

- 댓글 기능 같은 동적인 기능 구현이 어렵습니다.
- 콘텐츠를 업데이트할 때 서버에 파일을 다시 업로드해야 합니다.
  정적 블로그를 만들 때 Jekyll, Hugo, Gatsby 그리고 Next.js 등을 많이 사용하십니다. 저는 제가 가장 익숙한 프레임워크인 Next.js를 사용해서 구현했습니다.

## 어떤 패키지 매니저가 좋을까?

정적으로 콘텐츠를 서빙하기로 마음 먹었고, 프레임워크는 Next.js를 사용하기로 결정했습니다. 이제 또 다른 선택의 시간입니다. 어떤 패키지 매니저가 좋을까 고민이 됩니다.

Java에는 maven과 gradle등이 있고, Python에는 pip와 conda등이 있습니다.

### Node.js 패키지 매니저 3대장

Node.js에서 가장 유명한 패키지 매니저 3개로, npm, yarn, pnpm이 있습니다. 이들의 특징과 차이에 대한 자세한 설명은 너무 길어지므로 기회가 되면 다음에 다뤄보도록 하겠습니다. 결론적으로 저는 pnpm을 선택했습니다. 여기서는 간단하게 제가 왜 이 프로젝트에 pnpm을 사용하기로 결정했는지 적어보겠습니다.

### 내가 pnpm을 선택한 이유

pnpm을 선택한 가장 중요한 이유로는 제가 한번도 사용해보지 않은 패키지 매니저라는 것 입니다. 개인 프로젝트를 하는 가장 좋은 점은 새로운 기술들을 부담없이 사용해볼 수 있다는 점에 있습니다. 이번 기회에 pnpm을 사용해보면서 다른 패키지 매니저와 어떻게 다른지 몸으로 느껴보고 싶었습니다.

두번째 이유로는 이 블로그 프로젝트의 모노레포로의 전환 가능성 입니다. 지금 당장은 볼로그 글들을 정적으로 서빙하지만 언젠가 글들도 늘어나고 이것저것 새로운 기능들을 추가하고 싶은 마음이 들면 백엔드도 추가할 계획이 있습니다. 그 때가 되면 저는 백엔드 프로젝트를 개별 리포로 분리하지 않고 지금 리포를 모노리포로 전환하는 방향으로 채택할 것 입니다. pnpm은 모노리포와 사용할 때 장점이 많은 패키지 매니저 입니다. 기본적으로 패키지왜 앱들간 분리된 node_modules를 기본적으로 제공하여 dependency간 충돌을 방지합니다.

세번째 이유로는 속도 입니다. pnpm은 모든 패키지를 전역 저장소에 보관하고 심볼릭 링크를 사용하여 프로젝트에 연결합니다. 따라서 디스크 공간이 절약되고 패키지 설치 속도가 훨씬 증가됩니다.

## Linter와 Formatter

가끔 글을 읽다보면 Linter 와 Formatter를 혼용하는 경우를 봅니다. 둘은 엄연히 다른 기능을 합니다.

### Linter

Linter는 코드의 품질 검사를 수행합니다. 예를 들어 코드의 스타일, 잠재적 오류, 문법등을 검사를 합니다. 이를 통해 코드를 정확하고 안정성 있게 쓰여지도록 도움을 줍니다. JavaScript 에는 ESLint가 가장 유명한 Linter 입니다.

### Formatter

Formatter는 들여쓰기, 줄바꿈등 코드의 스타일을 정리하는 역할을 합니다. 코드가 일관적이고 가독성 좋게 작성되도록 도움을 줍니다. 대표적으로 JavaScript에는 Prettier가 있습니다.

보통 이제 Linter랑 Formatter랑 같이 사용합니다. Formatter로 코드 스타일을 통일하고 → Linter로 코드의 품질을 검사합니다.

### ESLint & Prettier

create-next-app으로 Next.js 프로젝트를 초기화 하면 ESLint와 국룰 React 규칙들은 같이 설치돼서 옵니다. 저는 ESLint 규칙은 따로 추가적으로 수정안하고 그대로 사용하는 것으로 하고 Formatter 만 prettier를 설치하고 ESLint와 Prettier의 충돌되는 규칙들을 꺼주는 `eslint-config-prettier`만 추가 설치해 주었습니다. Prettier 규칙도 Default로 설정되어 있는 것을 그대로 따를 것 이기 때문에 별도로 `.prettierrc` 파일을 만들지 않았습니다.

### 그런데 ESLint가 일을 안한다

VS Code에서 ESLint 규칙들이 실시간으로 검사되고 있는지 확인하려면 VSCode ESLint extension을 Marketplace에서 설치해주어야 합니다. 이렇게 설치해주고 확인해보니 밑에 VS Code ESlint output에 아래와 같이 에러가 떴습니다.

```
[Info  - 1:16:45 PM] ESLint server is starting.
[Info  - 1:16:46 PM] ESLint server running in node v22.12.0
[Info  - 1:16:46 PM] ESLint server is running.
[Info  - 1:16:48 PM] ESLint library loaded from: C:\Workspace\ThnJK\node_modules\.pnpm\eslint@9.17.0\node_modules\eslint\lib\api.js
[Error - 1:16:50 PM] Calculating config file for file:///c%3A/Workspace/ThnJK/next.config.mjs) failed.
Error: Failed to load plugin 'react-hooks' declared in ' » eslint-config-next/core-web-vitals » C:\Workspace\ThnJK\node_modules\.pnpm\eslint-config-next@15.1.0_eslint@9.17.0_typescript@5.7.2\node_modules\eslint-config-next\index.js': Cannot find module 'eslint-plugin-react-hooks'
Require stack:
- C:\Workspace\ThnJK\__placeholder__.js
Referenced from: C:\Workspace\ThnJK\node_modules\.pnpm\eslint-config-next@15.1.0_eslint@9.17.0_typescript@5.7.2\node_modules\eslint-config-next\index.js
    at Function.<anonymous> (node:internal/modules/cjs/loader:1249:15)
    at mod._resolveFilename (C:\Workspace\ThnJK\node_modules\.pnpm\eslint-config-next@15.1.0_eslint@9.17.0_typescript@5.7.2\node_modules\eslint-config-next\index.js:50:26)
    at Function.resolve (node:internal/modules/helpers:148:19)
    at Module.resolve (file:///C:/Workspace/ThnJK/node_modules/.pnpm/@eslint+eslintrc@3.2.0/node_modules/@eslint/eslintrc/lib/shared/relative-module-resolver.js:23:46)
    at ConfigArrayFactory._loadPlugin (file:///C:/Workspace/ThnJK/node_modules/.pnpm/@eslint+eslintrc@3.2.0/node_modules/@eslint/eslintrc/lib/config-array-factory.js:1068:33)
    at ConfigArrayFactory._loadExtendedPluginConfig (file:///C:/Workspace/ThnJK/node_modules/.pnpm/@eslint+eslintrc@3.2.0/node_modules/@eslint/eslintrc/lib/config-array-factory.js:887:29)
    at ConfigArrayFactory._loadExtends (file:///C:/Workspace/ThnJK/node_modules/.pnpm/@eslint+eslintrc@3.2.0/node_modules/@eslint/eslintrc/lib/config-array-factory.js:808:29)
    at ConfigArrayFactory._normalizeObjectConfigDataBody (file:///C:/Workspace/ThnJK/node_modules/.pnpm/@eslint+eslintrc@3.2.0/node_modules/@eslint/eslintrc/lib/config-array-factory.js:749:25)
    at _normalizeObjectConfigDataBody.next (<anonymous>)
    at ConfigArrayFactory._normalizeObjectConfigData (file:///C:/Workspace/ThnJK/node_modules/.pnpm/@eslint+eslintrc@3.2.0/node_modules/@eslint/eslintrc/lib/config-array-factory.js:694:20)
[Error - 1:16:50 PM] Calculating config file for file:///c%3A/Workspace/ThnJK/package.json) failed.
Error: Failed to load plugin 'react-hooks' declared in ' » eslint-config-next/core-web-vitals » C:\Workspace\ThnJK\node_modules\.pnpm\eslint-config-next@15.1.0_eslint@9.17.0_typescript@5.7.2\node_modules\eslint-config-next\index.js': Cannot find module 'eslint-plugin-react-hooks'
Require stack:
- C:\Workspace\ThnJK\__placeholder__.js
Referenced from: C:\Workspace\ThnJK\node_modules\.pnpm\eslint-config-next@15.1.0_eslint@9.17.0_typescript@5.7.2\node_modules\eslint-config-next\index.js
    at Function.<anonymous> (node:internal/modules/cjs/loader:1249:15)
    at mod._resolveFilename (C:\Workspace\ThnJK\node_modules\.pnpm\eslint-config-next@15.1.0_eslint@9.17.0_typescript@5.7.2\node_modules\eslint-config-next\index.js:50:26)
    at Function.resolve (node:internal/modules/helpers:148:19)
    at Module.resolve (file:///C:/Workspace/ThnJK/node_modules/.pnpm/@eslint+eslintrc@3.2.0/node_modules/@eslint/eslintrc/lib/shared/relative-module-resolver.js:23:46)
    at ConfigArrayFactory._loadPlugin (file:///C:/Workspace/ThnJK/node_modules/.pnpm/@eslint+eslintrc@3.2.0/node_modules/@eslint/eslintrc/lib/config-array-factory.js:1068:33)
    at ConfigArrayFactory._loadExtendedPluginConfig (file:///C:/Workspace/ThnJK/node_modules/.pnpm/@eslint+eslintrc@3.2.0/node_modules/@eslint/eslintrc/lib/config-array-factory.js:887:29)
    at ConfigArrayFactory._loadExtends (file:///C:/Workspace/ThnJK/node_modules/.pnpm/@eslint+eslintrc@3.2.0/node_modules/@eslint/eslintrc/lib/config-array-factory.js:808:29)
    at ConfigArrayFactory._normalizeObjectConfigDataBody (file:///C:/Workspace/ThnJK/node_modules/.pnpm/@eslint+eslintrc@3.2.0/node_modules/@eslint/eslintrc/lib/config-array-factory.js:749:25)
    at _normalizeObjectConfigDataBody.next (<anonymous>)
    at ConfigArrayFactory._normalizeObjectConfigData (file:///C:/Workspace/ThnJK/node_modules/.pnpm/@eslint+eslintrc@3.2.0/node_modules/@eslint/eslintrc/lib/config-array-factory.js:694:20)
```

문제의 원인을 알아보도록 하겠습니다. 저는 Next.js 프로젝트에서 권장하는 config인 `eslint-config-next`을 사용하고 있습니다. 해당 config에는 여러가지 플러그인들을 사용하고 있는데, 저의 에러 로그를 확인해보면 `eslint-plugin-react-hooks`를 찾지 못한다는 말입니다. npm 이나 yarn으로 프로젝트를 초기화했을 때는 문제가 없지만 pnpm를 사용하면 문제가 발생합니다. 

이 문제의 원인을 이해하기 위해서는 우선 어떻게 ESLint가 config 와 plugin을 로드하는지, 그리고 pnpm이 어떻게 패키지를 관리하는지에 대해서 알아야 합니다. 

우선 어떻게 ESLint가 config와 plugin을 로드하는지 부터 알아보겠습니다. 아래의 예제 에서는 `eslint-plugin-jsdoc` 플러그인을 로드하고 몇가지 규칙들을 설정해주는 코드입니다.

```js
// .eslintrc.js
module.exports = {
	// ...other config
	plugins: ["jsdoc"],
	rules: {
		"jsdoc/require-description": "error",
		"jsdoc/check-values": "error",
	},
	// ...other config
};
```

일반적으로 저희가 JavaScript 패키지를 설치해서 불러오려면 `require` 이나 `import`를 사용하는데, 위 예제 코드에서는 찾아볼 수 없습니다. 단지 `plugins: ["jsdoc"]`에서 문자열로 플러그인을 참조하고 있는걸 확인할 수 있습니다. 이렇게 문자열로 플러그인을 지정하면 ESLint가 알아서 `node_modules`에서 찾아서 로딩하는 방식이였습니다.

이렇게 작동하는 방식이 npm과 yarn을 사용할 때는 문제가 되지 않았습니다. 왜냐면 이 둘은 패키지를 설치할 때 패키지와 해당 패키지의 dependencies를 `node_modules` 최상위에 설치합니다. 이를 Dependency Hoisting이라고 합니다. ESLint는 plugin과 config를 찾을 때 최상위 `node_modules`에서 찾기 때문에 npm과 yarn에서는 문제가 없었습니다.

하지만 pnpm은 패키지들을 `node_modules` 최상위에 설치하지 않습니다. 최상위에 설치하지 않을 뿐, 기본 설정 값으로는 dependency hoisting이 여전히 적용되고 있습니다. 다만, `node_modules/.pnpm/node_modules`이 경로에서 hoisting되고 있기 때문에 프로젝트의 package.json에 리스트 되지 않은 패키지들(phantom package 라고 부릅니다)은 접근이 불가능합니다. 그래서 ESLint가 `eslint-plugin-react-hooks`를 찾지 못했습니다. 저희가 직접적으로 설치한게 아닌 `eslint-config-next`에서 간접적으로 설치됐기 때문이죠.

ESLint 관련 패키지들은 강제로 최상위 `node_modules`에 설치되도록하면 모든 것이 해결될 것 같습니다. 그렇게 하기 위해서는 `.npmrc` 파일을 만들어서 `public-hoist-pattern`을 넣어주면 됩니다.

```yaml
# .npmrc
publicHoistPattern:
- "*eslint*"
```

이렇게 하면 `*eslint*` 패턴의 이름을 가진 패키지들은 자동적으로 최상위 node_modules에 설치되게 됩니다. 이 값을 적용하니 ESLint가 정상적으로 작동됐습니다.


## 마무리

블로그 만들기는 아마 시리즈로 작성하게 될 것 같습니다. 아무래도 분량이 많다보니… 다음 글에서는 어떤 UI Components 와 Styling 라이브러리를 선택하였는지 선택한 라이브러리들 기본 세팅한 것들을 조금 소개드려보려고 합니다.

두서 없는 글 시간내서 읽어주셔서 감사합니다.

## 참고
- [Using public-hoist-pattern breaks ESLint extension?! #8878](https://github.com/pnpm/pnpm/issues/8878#issuecomment-2547568225)
