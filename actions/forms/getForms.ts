"use cache";

import { Form } from "@/lib/generated/prisma/client";
import prisma from "@/lib/prisma";
import { cacheTag } from "next/cache";

export async function getForms(userId: string) {
  cacheTag("user-forms", userId);
  if (!userId) {
    return {
      forms: [],
      message: "Ensure Authentication for better experience...",
    };
  }
  try {
    const forms: Form[] = await prisma.form.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
    });

    return { forms: forms, message: "Your forms are ready" };
  } catch (error) {
    return { forms: [], message: error as string };
  }
}
