"use client";

import * as React from "react";
import { buttonVariants } from "@/components/ui/button";
import { Shell } from "@/components/shell";
import Link from "next/link";
import { Confetti, type ConfettiRef } from "@/components/magicui/confetti";

export default function SubscribeCompletePage() {
  const confettiRef = React.useRef<ConfettiRef>(null);

  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  React.useEffect(() => {
    // Workaround for page not being scrolled to top on redirect from server action
    confettiRef.current?.fire();
  }, []);

  return (
    <Shell className="flex flex-col items-center justify-center py-25">
      <div className="w-full rounded-xl shadow-md p-8 text-center space-y-6">
        <h1 className="text-4xl font-bold">구독 신청이 완료되었습니다.</h1>
        <p className="text-base text-muted-foreground">
          뉴스레터에 구독해 주셔서 감사합니다.
          <br />
          등록해주신 이메일을 통해 소식을 보내드릴게요.
        </p>
        <Link href="/" className={buttonVariants()}>
          홈으로 돌아가기
        </Link>
      </div>
      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-0 pointer-events-none size-full"
      />
    </Shell>
  );
}
