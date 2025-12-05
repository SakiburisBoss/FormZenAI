"use client";

import { FormContent } from "@/actions/forms/generate-form";
import { publishForm } from "@/actions/forms/publish-form";
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
  const [successDialogOpen, setSuccessDialogOpen] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSaveAsDraft = () => {
    toast.success(
      "Form saved as draft! You can publish it anytime from My Forms.",
    );
    router.push("/forms");
    router.refresh(); // Force refresh to show updated forms list
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEditMode) {
      // In edit mode, publish the form
      setIsPublishing(true);
      const result = await publishForm(form.id);
      setIsPublishing(false);

      if (result.success) {
        setSuccessDialogOpen(true);
        router.refresh(); // Force refresh to show updated forms list
      } else {
        toast.error(result.message || "Failed to publish form");
      }
    } else {
      // In view mode, submit the form
      setIsSubmitting(true);

      const formData = new FormData(formRef.current!);
      const result = await submitForm(form.id, formData);

      setIsSubmitting(false);

      if (result.success) {
        toast.success(result.message || "Form submitted successfully!");
        formRef.current?.reset();
      } else {
        toast.error(result.message || "Failed to submit form");
      }
    }
  };

  const formContent: FormContent =
    typeof form.content === "string" ? JSON.parse(form.content) : form.content;

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      {/* Back Button - Only in Edit Mode */}
      {isEditMode && (
        <div className="mb-4">
          <Link
            href={"/forms"}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to {"Forms"}
          </Link>
        </div>
      )}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <form
          ref={formRef}
          onSubmit={handleFormSubmit}
          className="p-8 space-y-6"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {formContent.formTitle}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {isEditMode
                ? "Review your form and publish when ready, or save as draft"
                : "Please fill out all required fields marked with *"}
            </p>
            {isEditMode && !form.published && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-sm font-medium rounded-lg">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                Draft - Not Published Yet
              </div>
            )}
          </div>

          {formContent.formFields.map((field, fieldIndex) => (
            <div
              key={fieldIndex}
              className="space-y-2 animate-fadeIn"
              style={{ animationDelay: `${fieldIndex * 50}ms` }}
            >
              <label
                htmlFor={field.name}
                className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2"
              >
                {field.label}
                {!isEditMode && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.inputTypes.map((inputType, typeIndex) => {
                const baseInputClasses = `
                  w-full px-4 py-3
                  bg-gray-50 dark:bg-gray-800
                  border-2 border-gray-200 dark:border-gray-700
                  rounded-xl
                  text-gray-900 dark:text-gray-100
                  placeholder:text-gray-500 dark:placeholder:text-gray-500
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-all duration-200
                  hover:border-gray-300 dark:hover:border-gray-600
                  disabled:opacity-50 disabled:cursor-not-allowed
                `;

                if (inputType === "textarea") {
                  return (
                    <textarea
                      key={typeIndex}
                      id={field.name}
                      name={field.name}
                      placeholder={field.placeholder}
                      required={!isEditMode}
                      disabled={isSubmitting || isPublishing}
                      className={baseInputClasses}
                      rows={5}
                    />
                  );
                }

                return (
                  <input
                    key={typeIndex}
                    id={field.name}
                    type={inputType}
                    name={field.name}
                    placeholder={field.placeholder}
                    required={!isEditMode}
                    disabled={isSubmitting || isPublishing}
                    className={baseInputClasses}
                  />
                );
              })}
            </div>
          ))}

          {/* Action Buttons */}
          {isEditMode ? (
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                type="button"
                onClick={handleSaveAsDraft}
                disabled={isPublishing}
                className="flex-1 px-6 py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                disabled={isPublishing}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isPublishing ? "Publishing..." : "Publish Form"}
              </button>
            </div>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? "Submitting..." : "Submit Form"}
            </button>
          )}
        </form>
      </div>

      {successDialogOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform animate-scaleIn">
            <div className="p-8 text-center">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Form Published!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your form has been published successfully and is now live.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/forms/${form.id}`,
                    );
                    toast.success("Link copied to clipboard!");
                  }}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Copy Form Link
                </button>

                <button
                  onClick={() => {
                    setSuccessDialogOpen(false);
                    router.push("/forms");
                  }}
                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  View My Forms
                </button>
                <button
                  onClick={() => {
                    setSuccessDialogOpen(false);
                    router.push("/");
                  }}
                  className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
                >
                  Go to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AiGeneratedForm;
