import { Metadata } from "next";
import { Shell } from "@/components/shell";
import { SubscribeForm } from "./_components/subscribe-form";

export const metadata: Metadata = {
  title: "구독하기",
  description: "새로운 포스트가 올라오면 이메일로 알려드릴게요.",
};

export default function SubscribePage() {
  return (
    <Shell className="flex flex-col items-center justify-center py-25">
      <div className="mx-auto w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">구독하기</h1>
          <p className="text-muted-foreground">
            새로운 포스트가 올라오면 이메일로 알려드릴게요.
          </p>
        </div>

        {/* Subscription Form */}
        <SubscribeForm />

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            언제든지 구독을 취소할 수 있습니다.
          </p>
        </div>
      </div>
    </Shell>
  );
}
