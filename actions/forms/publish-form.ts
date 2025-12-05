"use server";

import { getUser } from "@/actions/user/getUser";
import prisma from "@/lib/prisma";
import { revalidatePath, updateTag } from "next/cache";

export const publishForm = async (formId: number | string) => {
  try {
    if (typeof formId === "string" && formId.startsWith("temp_")) {
      return {
        success: false,
        message: "Anonymous form publishing is handled client-side",
        isAnonymous: true,
      };
    }

    const user = await getUser();
    const userId = user!.id; // getUser() always returns a user

    const numericFormId =
      typeof formId === "string" ? parseInt(formId) : formId;

    if (!numericFormId) {
      return { success: false, message: "Form ID not provided" };
    }

    const form = await prisma.form.findUnique({
      where: {
        id: numericFormId,
      },
    });

    if (!form) {
      return { success: false, message: "Form not found" };
    }

    if (form.ownerId !== userId) {
      return { success: false, message: "You are not the owner of this form" };
    }

    await prisma.form.update({
      where: {
        id: numericFormId,
      },
      data: {
        published: true,
      },
    });
    updateTag("user-forms");
    updateTag(userId);
    updateTag("draft-form");
    updateTag(`form-${form.id}`);

    revalidatePath("/forms");
    revalidatePath(`/forms/${form.id}`);
    revalidatePath(`/forms/${form.id}/edit`);
    return { success: true, message: "Form published successfully!" };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: "An error occurred while publishing the form",
    };
  }
};
