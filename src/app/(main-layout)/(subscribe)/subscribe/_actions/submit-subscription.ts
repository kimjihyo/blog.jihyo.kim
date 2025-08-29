"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

interface SubscriptionFormState {
  errors?: {
    name?: string[];
    email?: string[];
    privacy?: string[];
  };
  message?: string;
  success?: boolean;
  values?: {
    name?: string;
    email?: string;
    privacy?: string;
  };
}

const subscriptionFormSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  email: z.string().email("올바른 이메일 주소를 입력해주세요."),
  privacy: z
    .string()
    .refine((val) => val === "true", "개인정보 수집 및 이용에 동의해주세요."),
});

export async function submitSubscription(
  _: SubscriptionFormState | null,
  formData: FormData,
): Promise<SubscriptionFormState> {
  const rawFormData = {
    name: formData.get("name"),
    email: formData.get("email"),
    privacy: formData.get("privacy"),
  };

  const validatedFields = subscriptionFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      values: {
        name: String(rawFormData.name ?? ""),
        email: String(rawFormData.email ?? ""),
        privacy: String(rawFormData.privacy ?? ""),
      },
    };
  }

  const { name, email } = validatedFields.data;

  // Here you would typically:
  // 1. Save to database
  // 2. Send confirmation email
  // 3. Add to mailing list service (e.g., Mailchimp, ConvertKit)

  // For now, we'll just log the subscription
  console.log("New subscription:", {
    name,
    email,
    subscribedAt: new Date().toISOString(),
  });

  redirect("/subscribe-complete");
}
