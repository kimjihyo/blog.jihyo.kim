"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

interface SubscriptionFormState {
  errors?: {
    name?: string[];
    email?: string[];
    categories?: string[];
    privacy?: string[];
  };
  message?: string;
  success?: boolean;
}

const subscriptionFormSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  email: z.string().email("올바른 이메일 주소를 입력해주세요."),
  categories: z.array(z.string()).optional(),
  privacy: z
    .string()
    .refine((val) => val === "true", "개인정보 수집 및 이용에 동의해주세요."),
});

export async function submitSubscription(
  _: SubscriptionFormState | null,
  formData: FormData
): Promise<SubscriptionFormState> {
  const rawFormData = {
    name: formData.get("name"),
    email: formData.get("email"),
    categories: formData.getAll("categories"),
    privacy: formData.get("privacy"),
  };

  const validatedFields = subscriptionFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { name, email, categories } = validatedFields.data;

    // Here you would typically:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Add to mailing list service (e.g., Mailchimp, ConvertKit)

    // For now, we'll just log the subscription
    console.log("New subscription:", {
      name,
      email,
      categories,
      subscribedAt: new Date().toISOString(),
    });

    revalidatePath("/subscribe");

    return {
      success: true,
      message: "구독이 완료되었습니다. 감사합니다!",
    };
  } catch (error) {
    console.error("Subscription error:", error);
    return {
      success: false,
      message: "구독 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
    };
  }
}
