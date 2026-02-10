"use client";

import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { submitComment } from "../_actions/submit-comment";
import { generateRandomNickname } from "../_utils/generate-random";
import { generateRandomAvatar } from "../_utils/generate-random";
import { Loader2 } from "lucide-react";

interface CommentFormProps {
  slug: string;
}

export function CommentForm({ slug }: CommentFormProps) {
  const [formState, formAction, isPending] = React.useActionState(
    submitComment,
    null,
  );
  const nicknameInputRef = React.useRef<HTMLInputElement>(null);
  const defaultNickname = React.useRef(generateRandomNickname());

  return (
    <form action={formAction} className="flex flex-col">
      <div>
        <div className="mb-3">
          <div className="flex w-full space-x-2">
            <div className="mt-1">
              <AvatarButton />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <div
                className={cn(
                  "flex h-12 w-60 items-center gap-2",
                  "flex rounded-md border border-input px-3 py-1 shadow-xs transition-colors outline-none hover:border-primary dark:bg-input/30",
                  "has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50",
                  formState?.errors?.nickname && "border-destructive",
                )}
              >
                <input
                  ref={nicknameInputRef}
                  type="text"
                  name="nickname"
                  placeholder="닉네임"
                  className="h-full min-w-0 text-base focus:outline-none"
                  defaultValue={defaultNickname.current}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    if (nicknameInputRef.current) {
                      nicknameInputRef.current.value = generateRandomNickname();
                      defaultNickname.current = nicknameInputRef.current.value;
                    }
                  }}
                >
                  랜덤 변경
                </Button>
              </div>
              {formState?.errors?.nickname && (
                <p className="px-3 text-sm text-destructive">
                  {formState.errors.nickname[0]}
                </p>
              )}
            </div>
          </div>
        </div>
        <div>
          <Textarea
            name="content"
            placeholder="입력한 댓글은 수정하거나 삭제할 수 없어요."
            disabled={isPending}
            className={cn(
              "min-h-16 resize-none",
              formState?.errors?.content && "border-destructive",
            )}
          />
          {formState?.errors?.content && (
            <p className="mt-1.5 text-sm text-destructive">
              {formState.errors.content[0]}
            </p>
          )}
        </div>
      </div>
      <input type="hidden" name="postSlug" value={slug} />
      <Button
        type="submit"
        className="relative mt-2 mb-5 ml-auto"
        disabled={isPending}
      >
        <span>댓글 남기기</span>
        {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
      </Button>
    </form>
  );
}

function AvatarButton() {
  const [avatar, setAvatar] = React.useState(generateRandomAvatar());

  return (
    <div
      role="button"
      className="group cursor-pointer transition-opacity hover:opacity-80"
      onClick={() => {
        setAvatar(generateRandomAvatar());
      }}
    >
      <Avatar className="size-10 transition-transform group-active:scale-95">
        <AvatarImage src={avatar} className="bg-sky-100" />
        <AvatarFallback></AvatarFallback>
      </Avatar>
      <input type="hidden" name="avatar" value={avatar} />
    </div>
  );
}
