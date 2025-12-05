"use server";

import { uploadToCloudinary } from "@/lib/cloudinary-upload";
import prisma from "@/lib/prisma";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

export const submitForm = async (
  formId: number | string,
  formData: FormData,
) => {
  try {
    if (!formId) {
      return {
        success: false,
        message: "Form ID not provided",
      };
    }

    const numericFormId =
      typeof formId === "string" ? parseInt(formId) : formId;

    const form = await prisma.form.findUnique({
      where: {
        id: numericFormId,
      },
    });

    if (!form) {
      return {
        success: false,
        message: "Form not found",
      };
    }

    if (!form.published) {
      return {
        success: false,
        message: "This form is not published yet",
      };
    }

    const submissionContent: Record<string, string> = {};

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        if (value.size > 0) {
          console.log(`Uploading file: ${value.name} (${value.size} bytes)`);

          try {
            const uploadResponse = await uploadToCloudinary(value);
            const fileUrl = uploadResponse.secure_url;

            submissionContent[key] = fileUrl;
            console.log(`File uploaded successfully: ${fileUrl}`);
          } catch (uploadError) {
            console.error(`Failed to upload file ${value.name}:`, uploadError);
            submissionContent[key] = `Upload failed: ${value.name}`;
          }
        } else {
          submissionContent[key] = "";
        }
      } else {
        submissionContent[key] = value.toString();
      }
    }

    await prisma.submissions.create({
      data: {
        formId: numericFormId,
        content: submissionContent,
      },
    });

    // Increment form submission count
    await prisma.form.update({
      where: { id: numericFormId },
      data: { submissions: { increment: 1 } },
    });

    updateTag("user-forms");
    updateTag(form.ownerId);

    revalidatePath("/forms");

    redirect("/forms");
  } catch (error) {
    console.error("Error submitting form:", error);
    return {
      success: false,
      message: "An error occurred while submitting the form",
    };
  }
};
