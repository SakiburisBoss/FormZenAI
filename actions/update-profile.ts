"use server";

import { auth } from "@/lib/auth"; // Better-auth server instance
import { headers } from "next/headers";
import { z } from "zod";

const ProfileSchema = z.object({
  name: z.string().min(2).max(50),
  image: z.url().optional(),
});

export async function updateProfileAction(prevState: any, formData: FormData) {
  const parsed = ProfileSchema.safeParse({
    name: formData.get("name"),
    image: formData.get("image"),
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid form fields" };
  }

  const { name, image } = parsed.data;

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, error: "Not authenticated" };
  }

  await auth.api.updateUser({
    body: { name, image },
    headers: await headers(),
  });

  return { success: true, message: "Profile updated" };
}
