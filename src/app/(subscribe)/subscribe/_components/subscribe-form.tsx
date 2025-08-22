"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { submitSubscription } from "../_actions/submit-subscription";
import { Loader2 } from "lucide-react";
import EmailField from "./email-field";

export function SubscribeForm() {
  const [formState, formAction, isPending] = React.useActionState(
    submitSubscription,
    null,
  );

  return (
    <div className="space-y-6">
      {/* Message Display */}
      {formState?.message && (
        <div
          className={`rounded-lg p-4 text-sm ${
            formState.success
              ? "border border-green-200 bg-green-50 text-green-800"
              : "border border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {formState.message}
        </div>
      )}

      {/* Subscription Form */}
      <form action={formAction} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            이름
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="이름을 입력해주세요"
            className={cn(
              "w-full",
              formState?.errors?.name && "border-destructive",
            )}
            defaultValue={formState?.values?.name ?? ""}
          />
          {formState?.errors?.name && (
            <p className="text-sm text-destructive">
              {formState.errors.name[0]}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            이메일
          </Label>
          <EmailField
            id="email"
            name="email"
            type="email"
            placeholder="이메일을 입력해주세요"
            className={cn(
              "w-full",
              formState?.errors?.email && "border-destructive",
            )}
            defaultValue={formState?.values?.email ?? ""}
          />
          {formState?.errors?.email && (
            <p className="text-sm text-destructive">
              {formState.errors.email[0]}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="privacy"
            name="privacy"
            defaultChecked={formState?.values?.privacy === "true"}
          />
          <Label htmlFor="privacy" className="text-muted-foreground">
            뉴스레터 수신을 위한 개인정보 수집 및 이용에 동의합니다
          </Label>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          <span>{isPending ? "처리 중..." : "동의하고 구독하기"}</span>
          {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      </form>
    </div>
  );
}
