"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import * as z from "zod";

const signInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  callbackURL: z.string(),
});

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  callbackURL: z.string(),
});

export const signUp = async (prevState: any, formData: FormData) => {
  try {
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      callbackURL: formData.get("callbackURL"),
    };

    const result = signUpSchema.safeParse(rawData);
    if (!result.success) {
      return { error: result.error.issues[0].message };
    }

    const validatedData = result.data;

    const authResult = await auth.api.signUpEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name,
        callbackURL: validatedData.callbackURL,
      },
    });

    if (!authResult.user) {
      return { error: "Failed to create account. Please try again." };
    }

    return { success: true };
  } catch (error) {
    return { error: "An unexpected error occurred. Please try again." };
  }
};

export const signIn = async (prevState: any, formData: FormData) => {
  try {
    const rawData = {
      email: formData.get("email"),
      password: formData.get("password"),
      callbackURL: formData.get("callbackURL"),
    };

    const result = signInSchema.safeParse(rawData);
    if (!result.success) {
      return { error: result.error.issues[0].message };
    }

    const validatedData = result.data;

    const authResult = await auth.api.signInEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
        callbackURL: validatedData.callbackURL,
      },
    });

    if (!authResult.user) {
      return { error: "Invalid email or password" };
    }

    return { success: true };
  } catch (error) {
    return { error: "An unexpected error occurred. Please try again." };
  }
};

export const signInSocial = async (
  provider: "github" | "google",
  callbackURL: string,
) => {
  const { url } = await auth.api.signInSocial({
    body: {
      provider,
      callbackURL: callbackURL,
    },
  });

  if (url) {
    redirect(url);
  }
};
export const signOut = async ({ callbackURL }: { callbackURL: string }) => {
  await auth.api.signOut({ headers: await headers() });
  revalidatePath(callbackURL);
  redirect(callbackURL);
};
