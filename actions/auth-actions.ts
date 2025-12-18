"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import * as z from "zod";

const signInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  callbackURL: z.string().optional(),
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
  callbackURL: z.string().optional(),
});

const coerceToString = (value: FormDataEntryValue | null) => {
  if (value === null) return "";
  if (typeof value === "string") return value;

  return "";
};

export const signUp = async (formData: FormData) => {
  let redirectTo: string | undefined;

  try {
    const rawData = {
      name: coerceToString(formData.get("name")),
      email: coerceToString(formData.get("email")),
      password: coerceToString(formData.get("password")),
      callbackURL: coerceToString(formData.get("callbackURL")),
    };

    const result = signUpSchema.safeParse(rawData);
    if (!result.success) {
      const msg = result.error?.issues?.[0]?.message ?? "Validation error";
      redirect(`/auth?error=${encodeURIComponent(msg)}`);
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
      redirect(
        `/auth?error=${encodeURIComponent("Failed to create an Account.Please try again")}`,
      );
    }

    revalidatePath(validatedData.callbackURL ?? "/");
    redirectTo = validatedData.callbackURL ?? "/";
  } catch (error) {
    redirect(
      `/auth?error=${encodeURIComponent("An unexpected error occurred. Please try again")}`,
    );
  }

  if (redirectTo) {
    redirect(redirectTo);
  }
};

export const signIn = async (formData: FormData) => {
  let redirectTo: string | undefined;

  try {
    const rawData = {
      email: coerceToString(formData.get("email")),
      password: coerceToString(formData.get("password")),
      callbackURL: coerceToString(formData.get("callbackURL")),
    };

    const result = signInSchema.safeParse(rawData);
    if (!result.success) {
      const msg = result.error?.issues?.[0]?.message ?? "Validation error";
      redirect(`/auth?error=${encodeURIComponent(msg)}`);
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
      redirect(
        `/auth?error=${encodeURIComponent("Invalid email or password")}`,
      );
    }
    revalidatePath(validatedData.callbackURL ?? "/");
    redirectTo = validatedData.callbackURL ?? "/";
  } catch (error) {
    redirect(
      `/auth?error=${encodeURIComponent("An unexpected error occurred. Please try again")}`,
    );
  }

  if (redirectTo) {
    redirect(redirectTo);
  }
};

export const signInSocial = async (
  provider: "github" | "google",
  callbackURL: string,
) => {
  const { url } = await auth.api.signInSocial({
    body: {
      provider: provider,
      callbackURL: callbackURL,
    },
  });

  if (!url) {
    redirect(`/auth?error=${encodeURIComponent("Social Log in failed")}`);
  }
  revalidatePath(url);
  redirect(url);
};

export const signOut = async ({ callbackURL }: { callbackURL: string }) => {
  await auth.api.signOut({ headers: await headers() });
  revalidatePath(callbackURL);
  redirect(callbackURL);
};
