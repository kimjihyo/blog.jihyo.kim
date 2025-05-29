"use server";

import { z } from "zod";

interface CommentFormState {
  errors?: {
    nickname?: string[];
    content?: string[];
    avatar?: string[];
  };
  message?: string;
}

const commentFormSchema = z.object({
  nickname: z.string().min(1, "닉네임을 입력해주세요."),
  content: z.string().min(1, "댓글을 입력해주세요."),
  avatar: z.string().min(1, "아바타를 선택해주세요."),
});

export async function submitComment(
  _: CommentFormState | null,
  formData: FormData
): Promise<CommentFormState> {
  const rawFormData = {
    nickname: formData.get("nickname"),
    content: formData.get("content"),
    avatar: formData.get("avatar"),
  };

  const validatedFields = commentFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // TODO: 댓글 저장
  return {
    message: "댓글이 성공적으로 등록되었습니다.",
  };
}
