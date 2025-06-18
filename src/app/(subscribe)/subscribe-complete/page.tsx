import { buttonVariants } from "@/components/ui/button";
import { Shell } from "@/components/shell";
import Link from "next/link";
import { ConfettiWrapper } from "./_components/confetti-wrapper";

export default function SubscribeCompletePage() {
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
      <ConfettiWrapper />
    </Shell>
  );
}
