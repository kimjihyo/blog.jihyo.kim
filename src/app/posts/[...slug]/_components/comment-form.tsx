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
  postSlug: string;
}

export function CommentForm({ postSlug }: CommentFormProps) {
  const [formState, formAction, isPending] = React.useActionState(
    submitComment,
    null
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
            <div className="flex flex-col gap-1.5 flex-1">
              <div
                className={cn(
                  "flex gap-2 items-center w-60 h-12",
                  "dark:bg-input/30 border-input flex rounded-md border bg-transparent px-3 py-1 shadow-xs transition-colors outline-none hover:border-primary",
                  "has-[:focus-visible]:border-ring has-[:focus-visible]:ring-ring/50 has-[:focus-visible]:ring-[3px]",
                  formState?.errors?.nickname && "border-destructive"
                )}
              >
                <input
                  ref={nicknameInputRef}
                  type="text"
                  name="nickname"
                  placeholder="닉네임"
                  className="h-full min-w-0 focus:outline-none bg-transparent text-sm sm:text-base"
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
                <p className="text-sm text-destructive px-3">
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
              "resize-none min-h-16",
              formState?.errors?.content && "border-destructive"
            )}
          />
          {formState?.errors?.content && (
            <p className="text-sm text-destructive mt-1.5">
              {formState.errors.content[0]}
            </p>
          )}
        </div>
      </div>
      <input type="hidden" name="postSlug" value={postSlug} />
      <Button
        type="submit"
        className="ml-auto mt-2 mb-5 relative"
        disabled={isPending}
      >
        {isPending && (
          <Loader2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 animate-spin" />
        )}
        <span className={cn(isPending ? "opacity-0" : "")}>댓글 남기기</span>
      </Button>
    </form>
  );
}

function AvatarButton() {
  const [avatar, setAvatar] = React.useState(generateRandomAvatar());

  return (
    <div
      role="button"
      className="cursor-pointer hover:opacity-80 transition-opacity group"
      onClick={() => {
        setAvatar(generateRandomAvatar());
      }}
    >
      <Avatar className="size-10 group-active:scale-95 transition-transform">
        <AvatarImage src={avatar} />
        <AvatarFallback></AvatarFallback>
      </Avatar>
      <input type="hidden" name="avatar" value={avatar} />
    </div>
  );
}
