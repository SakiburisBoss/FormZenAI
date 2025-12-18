"use client";

import { FormContent } from "@/actions/forms/generate-form";
import { submitForm } from "@/actions/forms/submit-form";
import { Form } from "@/lib/generated/prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

type Props = {
  form: Form;
  isEditMode: boolean;
};

const AiGeneratedForm: React.FC<Props> = ({ form, isEditMode }) => {
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSaveAsDraft = () => {
    toast.success("Form saved as draft!");
    router.push("/forms");
    router.refresh();
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(formRef.current!);
    const result = await submitForm(form.id, formData);

    setIsSubmitting(false);

    if (!result) {
      toast.error("Submission failed");
      return;
    }

    if (!result.success) {
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, message]) => {
          toast.error(`${field}: ${message}`);
        });
      } else {
        toast.error(result.message);
      }
      return;
    }

    toast.success(result.message);
    formRef.current?.reset();
    router.push("/forms");
  };

  const formContent: FormContent =
    typeof form.content === "string" ? JSON.parse(form.content) : form.content;

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      {isEditMode && (
        <div className="mb-4">
          <Link href="/forms" className="text-sm text-gray-600">
            Back to Forms
          </Link>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
        <form
          ref={formRef}
          onSubmit={handleFormSubmit}
          className="p-8 space-y-6"
        >
          <div>
            <h2 className="text-3xl font-bold">{formContent.formTitle}</h2>
          </div>

          {formContent.formFields.map((field, fieldIndex) => (
            <div key={fieldIndex} className="space-y-2">
              <label className="block font-semibold">{field.label}</label>

              {field.inputTypes.map((inputType, typeIndex) =>
                inputType === "textarea" ? (
                  <textarea
                    key={typeIndex}
                    name={field.name}
                    placeholder={field.placeholder}
                    required={!isEditMode}
                    disabled={isSubmitting || isPublishing}
                    className="w-full border rounded-lg p-3"
                  />
                ) : (
                  <input
                    key={typeIndex}
                    type={inputType}
                    name={field.name}
                    placeholder={field.placeholder}
                    required={!isEditMode}
                    disabled={isSubmitting || isPublishing}
                    className="w-full border rounded-lg p-3"
                  />
                ),
              )}
            </div>
          ))}

          {isEditMode && !form.published ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSaveAsDraft}
                disabled={isPublishing}
                className="flex-1 bg-gray-200 rounded-lg p-4"
              >
                Save as Draft
              </button>

              <button
                type="submit"
                disabled={isPublishing}
                className="flex-1 bg-blue-600 text-white rounded-lg p-4"
              >
                {isPublishing ? "Publishing..." : "Publish Form"}
              </button>
            </div>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white rounded-lg p-4"
            >
              {isSubmitting ? "Submitting..." : "Submit Form"}
            </button>
          )}
        </form>
      </div>

      {successDialogOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold mb-4">Form Published</h3>
            <button
              onClick={() => router.push("/forms")}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              View My Forms
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiGeneratedForm;
