"use server";

import { uploadToCloudinary } from "@/lib/cloudinary-upload";
import prisma from "@/lib/prisma";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

const SubmissionSchema = z.record(
  z.string(),
  z.string().min(1, "Field is required"),
);

export const submitForm = async (
  formId: number | string,
  formData: FormData,
) => {
  try {
    const numericFormId = typeof formId === "string" ? Number(formId) : formId;

    if (!numericFormId || Number.isNaN(numericFormId)) {
      return { success: false, message: "Invalid form ID" };
    }

    const form = await prisma.form.findUnique({ where: { id: numericFormId } });
    if (!form) return { success: false, message: "Form not found" };
    if (!form.published)
      return { success: false, message: "Form is not published yet" };

    const rawContent: Record<string, string> = {};
    const filesToUpload: Record<string, File> = {};

    for (const [key, value] of formData.entries()) {
      if (value instanceof File && value.size > 0) {
        filesToUpload[key] = value;
      } else {
        rawContent[key] = value.toString();
      }
    }

    const validation = SubmissionSchema.safeParse(rawContent);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        const field = String(issue.path[0]);
        fieldErrors[field] = issue.message;
      }
      return { success: false, message: "Validation failed", fieldErrors };
    }

    const submissionContent: Record<string, string> = { ...validation.data };

    for (const [key, file] of Object.entries(filesToUpload)) {
      try {
        const upload = await uploadToCloudinary(file);
        submissionContent[key] = upload.secure_url;
      } catch (err) {
        submissionContent[key] = "";
        return {
          success: false,
          message: `Failed to upload file for field "${key}"`,
        };
      }
    }

    await prisma.submissions.create({
      data: { formId: numericFormId, content: submissionContent },
    });
    await prisma.form.update({
      where: { id: numericFormId },
      data: { submissions: { increment: 1 } },
    });

    updateTag("user-forms");
    updateTag(form.ownerId);
    revalidatePath("/forms");

    return { success: true, message: "Form submitted successfully" };
  } catch (error) {
    console.error("Server error during submission:", error);
    return { success: false, message: "Unexpected server error" };
  }
};
