---
tags: ["Blog", "Web"]
createdTime: "2025-07-09T00:00:00Z"
thumbnail: "https://res.cloudinary.com/dab33vdij/image/upload/v1752047052/%E1%84%89%E1%85%B1%E1%86%B8%E1%84%8C%E1%85%B5%E1%84%8B%E1%85%A1%E1%86%AD%E1%84%8B%E1%85%B3%E1%86%AB%E1%84%83%E1%85%A6_rz25xn.jpg"
summary: "Framer Motion으로 텍스트 애니메이션을 적용했는데 예상치 못한 움찔거림과 Paint가 발생한 이유를 렌더링 파이프라인 관점에서 디버깅해봤다"
updatedTime: "2025-07-09T00:00:00Z"
title: "애니메이션 시 텍스트 움찔거림, 원인과 해결하기"
---

## 문제 상황

![](https://res.cloudinary.com/dab33vdij/image/upload/v1752046431/shakky_mnxkco.gif)

블로그를 조금 더 인터랙티브하게 만들고 싶어서 포스트 목록에 애니메이션을 추가했다. 그런데 자세히 보면 애니메이션이 동작할 때 텍스트가 조금씩 움찔거리는 현상이 보인다.

Motion(구 framer-motion)을 사용해서 `translate`와 `scale`, `opacity` 값에 애니메이션을 주었는데, Chrome DevTools의 Performance 탭으로 분석해보니 예상과 달리 Paint 단계가 반복적으로 발생하고 있었다.

아래 캡처한 Performance Tab 이미지를 보면 Paint 호출이 계속 반복되고 있음을 확인할 수 있다.

![Screenshot 2025-07-08 at 5.31.27 PM.png](https://res.cloudinary.com/dab33vdij/image/upload/v1752045681/perf-event-log1_vusirz.png)

브라우저의 렌더링 파이프라인은 Style → Layout → Paint → Composite 순으로 구성되어 있다. Composite 이전 단계인 Style, Layout, Paint는 모두 브라우저의 메인 쓰레드에서 실행된다.

메인 쓰레드는 렌더링 외에도 사용자 입력 처리나 스크립트 실행 등 여러 가지 일을 동시에 처리하기 때문에, 이 단계들이 지나치게 자주 실행되면 사이트의 반응성이 떨어진다.

반면에 Composite 단계는 GPU에서 처리되기 때문에 메인 쓰레드의 부담을 줄일 수 있다. 그래서 Layout과 Paint 단계를 건너뛰고 Composite 단계에서만 렌더링을 처리하는 것이 성능 면에서 더 유리하다.

`transform`, `scale`, `opacity` 같은 CSS 속성은 Layout과 Paint 단계를 거치지 않고 Composite 단계에서만 처리된다. 그래서 원칙적으로는 메인 쓰레드에 부담을 주지 않고 GPU에서만 렌더링이 일어나야 한다.

그러나 위에서 본 것처럼 실제로는 Paint가 반복적으로 발생하고 있다. 결국 무엇인가가 예상치 않게 Paint 단계를 계속 트리거하고 있다는 뜻이다.

## Paint가 반복적으로 발생한 이유

먼저 애니메이션되는 요소가 컴포지팅 레이어로 제대로 분리되었는지 확인해보았다. Chrome DevTools의 Performance 탭에서 화면을 녹화한 뒤, 스냅샷을 선택하면 해당 시점의 레이어 구성을 직접 볼 수 있다.

아래 이미지를 보면, 요소들이 컴포지팅 레이어로 분리되어 있고, 각 레이어가 왜 분리되었는지도 친절하게 표시된다. 예를 들어 `(Compositing Reasons: Has an active accelerated opacity animation or transition)` 같은 식으로 가속 처리가 적용된 이유가 함께 나온다.

![already-handled-in-composition.png](https://res.cloudinary.com/dab33vdij/image/upload/v1752045681/perf-layers_qf1c3x.png)

두번째로, 자식 요소 중에 Pain를 유발시키는 것이 있는지 확인해보았다. 많은 디버깅 끝에 결국 문제가 되는 요소를 찾아냈다. 아래 코드는 문제의 원인이 된 부분이다.

```tsx title="post-card.tsx" {4,7}
<div className="w-[90px] h-[65px] sm:w-[130px] sm:h-[90px] overflow-hidden rounded bg-card group">
  <div className="relative w-full h-full group-hover:scale-120 transition-transform duration-300">
    <Image
      fill
      sizes="(max-width: 640px) 90px, 130px"
      alt=""
      className="w-full h-full object-center object-cover"
      src={post.thumbnail}
    />
  </div>
</div>
```

내가 관찰한 현상은 이렇다. 부모 요소의 `transform` 값이 변하면서 요소가 컴포지팅 레이어로 분리되더라도, 자식에 `<img />` 요소가 포함되어 있고, 그 자식 요소가 `position: absolute` 와 `object-fit: cover` 같은 CSS 속성을 가지고 있으면 repaint가 발생한다는 점이다.

위 코드는 Next.js의 `<Image />` 를 사용했고, `fill` prop이 사용됨에 따라 `position: absolute` 가 적용됐다. 여기에 `object-cover` 까지 사용되면서 결국 repaint가 일어나게 된 것이다.

이 현상에 대해서 설명하고 있는 문서나 글을 찾지는 못했는데, 이러한 현상이 발생한 이유에 대한 나의 추측은 이렇다. 위의 상황에서 컴포지팅 레이어로 분리되더라도, 이미지의 crop/clip box가 재계산되며, 이 때 브라우저는 GPU 컴포지션만으로 처리하지 못하고, rasterize 단계에서 repaint를 발생시키는 것 같다.

따라서 아래와 같이 코드를 수정했다. `fill` prop을 지워 정적으로 포지션되게 만들었다.

```tsx title="post-card.tsx"
<div className="w-[130px] h-[90px] overflow-hidden rounded">
  <Image
    width={130}
    height={90}
    sizes="(max-width: 640px) 90px, 130px"
    alt=""
    className="w-[130px] h-[90px] object-center object-cover rounded group-hover:scale-120 transition-transform duration-300"
    src={post.thumbnail}
  />
</div>
```

적용 후 Perfomance Tab의 Event Log를 보니 Paint 단계가 생략된 것을 확인할 수 있었다.

![Screenshot 2025-07-08 at 5.54.51 PM.png](https://res.cloudinary.com/dab33vdij/image/upload/v1752045681/perf-event-log2_urgqzv.png)

## 그래도 여전히 움찔거린다.

Motion은 JS로 `transform` 값을 직접 변경한다. JS를 사용하던 CSS를 사용하던 `transform` 변경에 따른 업데이트는 컴포지팅 단계에서 처리된다.

앞서 확인했듯 애니메이션되는 각 요소는 이미 개별적인 컴포지팅 레이어로 분리돼 처리됐다.

같은 애니메이션을 Motion을 사용하지 않고 CSS Animation을 사용해서 구현해 보았을 때는 움찔거림이 없었다. 컴포지팅 레이어 또한 동일하게 분리되는 듯 보였다.

논리적으로는 Motion은 CSS animation과 같은 렌더링 경로를 타야 하는데, 왜 움찔거림이 발생하는지 의문이다.

### will-change를 사용하면 해결되긴 하는데

Motion의 예제 중 [Split Text](https://examples.motion.dev/react/split-text) 에서 Text를 애니메이션할 때 `will-change: transform`이 함께 사용되는 것을 볼 수 있다. 내 컴포넌트에도 `will-change: transform`을 적용하니 떨림 현상 없이 애니메이션이 부드럽게 동작했다.

![](https://res.cloudinary.com/dab33vdij/image/upload/v1752044122/fixed_vsgjyv.gif)

그런데 왜 그런지 이유가 궁금하다.

`will-change` 는 미리 명시적으로 애니메이션될 요소를 컴포지팅 레이어로 분리시킨다. 이번 문제의 경우에는 브라우저가 이미 잘 알아서 컴포지팅 레이어로 분리해주었기 때문에 필요없다고 생각했다.

이 문제에 대한 이유를 명확하게 설명해놓은 글을 찾을 수 없었다. 따라서 나의 추측을 적어보겠다.

### 추측

JavaScript로 `transform` 값을 직접 변경하는 애니메이션(`framer-motion` 등)을 사용할 때는, 브라우저가 해당 요소를 새로운 컴포지팅 레이어로 분리할지 heuristic 으로 실시간 판단한다. 요소의 크기, 변화 빈도, 레이아웃 맥락 등을 종합해 “굳이 레이어를 올려야 할지”를 매 프레임 결정하는데, 이 과정에서 레이어를 올리거나 내리는(promote/demote) 작업이 애니메이션과 동시에 일어나면 GPU 텍스처 생성·업로드나 기존 페인트 복제 같은 추가 오버헤드가 발생할 것이다.

반면 CSS 애니메이션은 `@keyframes`와 `animation-duration` 같은 정보가 명시적으로 선언되어 있어, 브라우저가 애니메이션 시작 전에 해당 요소를 반드시 새로운 컴포지팅 레이어로 분리해야 한다는 것을 알고있다. 덕분에 레이어 생성이 사전에 끝나고, 런타임에는 GPU 컴포지팅만 수행되므로 불필요한 오버헤드가 발생하지 않을 것이다.

따라서 JavaScript 기반 애니메이션에 `will-change: transform`을 사용하면 **브라우저에게** “이 요소는 transform이 자주 바뀔 예정”이라는 힌트를 미리 제공할 수 있다. 이를 통해 휴리스틱 판단 대신 확정적으로 레이어를 분리하게 되어, CSS 애니메이션과 같은 사전 최적화 효과를 얻고 예상치 못한 런타임 비용 없이 부드러운 애니메이션을 유지할 수 있는 듯 하다.

## 참고

- [web.dev Rendering Performance](https://web.dev/articles/rendering-performance)
- [web.dev Stick to Compositor-only Properties and Manage Layer Count](https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count)
- [web.dev Why are some animations slow?](https://web.dev/articles/animations-overview)
- [ghlee will-change의 숨겨진 의미](https://ghlee.dev/posts/what-will-change-really-means)
