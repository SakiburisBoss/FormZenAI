"use server";

import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getUser } from "../user/getUser";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export type FormField = {
  label: string;
  name: string;
  placeholder: string;
  inputTypes: string[];
};

export type FormContent = {
  formTitle: string;
  formFields: FormField[];
};

const inputSchema = z.object({
  description: z.string().min(1, "Description is required"),
});

const isFormField = (field: unknown): field is FormField => {
  if (typeof field !== "object" || field === null) return false;
  const f = field as Record<string, unknown>;
  return (
    typeof f.label === "string" &&
    typeof f.name === "string" &&
    typeof f.placeholder === "string" &&
    Array.isArray(f.inputTypes) &&
    f.inputTypes.every((t): t is string => typeof t === "string")
  );
};

const isFormContent = (data: unknown): data is FormContent => {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.formTitle === "string" &&
    Array.isArray(d.formFields) &&
    d.formFields.every(isFormField)
  );
};

type GenerateFormResult = {
  success: boolean;
  message: string;
  data?: {
    id: number | string;
    content: FormContent;
    isTemporary?: boolean;
  };
  error?: unknown;
  isAnonymous?: boolean;
};

export const generateForm = async (
  prevState: GenerateFormResult,
  formData: FormData,
): Promise<GenerateFormResult> => {
  try {
    const userId = (await getUser())?.id;
    if (!userId) {
      return { success: false, message: "User not authenticated" };
    }
    const parseResult = inputSchema.safeParse({
      description: formData.get("description") as string,
    });

    if (!parseResult.success) {
      return {
        success: false,
        message: "Invalid form data",
        error: parseResult.error.issues,
      };
    }

    const description = parseResult.data.description;

    if (!process.env.GEMINI_API_KEY) {
      return { success: false, message: "GEMINI API key not found" };
    }

    const prompt = `Generate a JSON response for a form with the following structure. Ensure the keys and format remain constant in every response.

{
  "formTitle": "string",
  "formFields": [
    {
      "label": "string",
      "name": "string",
      "placeholder": "string",
      "inputTypes": ["string"]
    }
  ]
}

Requirements:
- Use only the given keys: "formTitle", "formFields", "label", "name", "placeholder", "inputTypes".
- Always include at least 3 fields in the "formFields" array.
- "inputTypes" must always be an array of one or more valid HTML input types (examples: ["text"], ["email"], ["file"], ["date"], ["checkbox"], ["textarea"], ["file","text"]).
- If a field label clearly suggests multiple input options (e.g., "Upload passport or NID number"), include all relevant input types in the "inputTypes" array.
- Do not invent new input types. Stick strictly to standard HTML input types or "textarea".
- Match inputTypes logically with the label (e.g., "Email Address" → ["email"], "Upload Resume" → ["file"], "Upload passport or NID number" → ["file","text"]).
- Never return multiple keys for the same purpose (e.g., don't mix "inputType" and "inputTypes"). Always use "inputTypes".
- Ensure the response is valid JSON without extra commentary or Markdown formatting.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const completion = await model.generateContent(`${description} ${prompt}`);

    let rawText = completion.response.text() || "";
    rawText = rawText.replace(/```json|```/g, "").trim();

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawText);
    } catch (e) {
      console.error("Invalid JSON from Gemini:", rawText);
      return { success: false, message: "AI response was not valid JSON" };
    }

    if (!isFormContent(parsedJson)) {
      console.error("Parsed JSON does not match FormContent type", parsedJson);
      return {
        success: false,
        message: "AI response does not match expected form structure",
      };
    }

    const form = await prisma.form.create({
      data: {
        ownerId: userId,
        content: parsedJson,
      },
    });
    updateTag("user-forms");
    updateTag(userId);
    revalidatePath("/forms");

    redirect(`/forms/${form.id}/edit`);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error("Error generating form", error);
    return {
      success: false,
      message: "An error occurred while generating the form",
      error,
    };
  }
};
