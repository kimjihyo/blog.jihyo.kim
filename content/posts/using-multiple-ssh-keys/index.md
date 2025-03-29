---
type: "post"
title: "한 컴퓨터에서 여러개의 SSH 키 사용하기"
summary: "나는 AWS Lightsail 에 배포되어있는 code-server 을 통해서 코딩하고있다. 당연히 Git과 Github도 사용하고 있다. 이렇게 remote server에서 작업하는 경우 Github  authentication을 어떻게 해야할지 고민해본 경우는 많지 않아서 좀 찾아보고 지금 사용하고 있는 방법을 기록해두려고 한다."
date: "2025-03-29T00:00:00Z"
tags: ["Git", "개발 세팅"]
thumbnail: "https://res.cloudinary.com/dab33vdij/image/upload/v1743248126/IMG_0398_ach7b9.jpg"
---

## 들어가기에 앞서

나는 AWS Lightsail 에 배포되어있는 code-server 을 통해서 코딩하고있다. 당연히 Git과 Github도 사용하고 있다. 이렇게 remote server에서 작업하는 경우 Github authentication을 어떻게 해야할지 고민해본 경우는 많지 않아서 좀 찾아보고 지금 사용하고 있는 방법을 기록해두려고 한다.

대부분의 경우에 내가 개인 맥북이나 윈도우 PC에서 command line 을 통해서 Github authentication 을 할 때에는 Git Credential Manager 을 설치 후 HTTPS를 통해서 Repo를 클론하면 Github의 Personal Access Token 이나 브라우저 로그인을 사용을 했다. authentication 정보는 각 Mac 에서 제공하는 Keychain 이나Windows 에서 제공하는 Credential Manager을 통해서 Cache 했다.

하지만 remote server에 나의 모든 Github 계정의 권한을 가진 authenticaiton 정보를 cache 해두기는 싫어서 나는 SSH protocol을 사용해서 각 repository 마다 다른 SSH Key를 사용하기로 결정했다. 이 경우에 내 remote server 가 털려도 위험해지는건 내 Github account 전체가 아닌 몇개의 repository들로 한정 지을수 있기 때문이다.

## 본문

나의 Github 유저 이름은 kimjihyo 이고, 두 개 이상의 private repository를 가지고 있다고 가정해보자.

- https://github.com/kimjihyo/repo1
- https://github.com/kimjihyo/repo2

그리고 나는 remote server 에서 personal access token 입력 없이 위 두 repo를 pull 하고 싶다. 그래서 나는 HTTPS 대신 SSH를 사용하기로 결정하였다. 각 repo 별로 ssh public, private key 를 만들었고 public key 는 각 Github repo에 등록을 해주었다. 우선은 첫번째 repo 의 private key 을 ssh-agent 에 넣어주었다. 각 repo 별로 remote origin url 은 아래와 같이 설정했다.

- ssh://git@github.com/kimjihyo/repo1.git
- ssh://git@github.com/kimjihyo/repo2.git

자, 이제 두번째 repo에서 push,pull 을 하려고 보니까 ssh-agent 가 가지고 있는 private key 는 repo1의 것이여서 repo2의 것으로 바꿔주어야하는 불편함이 생긴다. 이러한 불편함을 해결하기 위해 ~/.ssh/config 이 있다.

```plain text
Host github.com-repo1
        Hostname github.com
        User git
        IdentityFile=~/.ssh/repo1

Host github.com-repo2
        Hostname github.com
        User git
        IdentityFile=~/.ssh/repo2
```

위와 같이 repo 별로 Host를 다르게 설정해준다. 그리고 각 repo 별로 remote origin 을 다음과 같이 수정해준다.

- ssh://git@github.com-repo1/kimjihyo/repo1.git
- ssh://git@github.com-repo2/kimjihyo/repo2.git

이렇게 설정해주면 매번 ssh-agent 에게 다른 private key를 넣어주지 않아도 자동으로 Host 별로 private key 를 맵핑해준다.
