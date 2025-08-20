"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { commentsTable } from "@/db/schema";

interface CommentFormState {
  errors?: {
    nickname?: string[];
    content?: string[];
    avatar?: string[];
  };
  message?: string;
  success?: boolean;
}

const commentFormSchema = z.object({
  nickname: z.string().min(1, "닉네임을 입력해주세요."),
  content: z.string().min(1, "댓글을 입력해주세요."),
  avatar: z.string().min(1, "아바타를 선택해주세요."),
  postSlug: z.string().min(1, "게시글을 찾을 수 없습니다."),
});

export async function submitComment(
  _: CommentFormState | null,
  formData: FormData
): Promise<CommentFormState> {
  const rawFormData = {
    nickname: formData.get("nickname"),
    content: formData.get("content"),
    avatar: formData.get("avatar"),
    postSlug: formData.get("postSlug"),
  };

  const validatedFields = commentFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await db.insert(commentsTable).values({
      ...validatedFields.data,
    });

    revalidatePath(`posts/${validatedFields.data.postSlug}`);

    return {
      success: true,
      message: "댓글이 성공적으로 등록되었습니다.",
    };
  } catch (_error) {
    return {
      success: false,
      message: "댓글 등록에 실패했습니다.",
    };
  }
}
