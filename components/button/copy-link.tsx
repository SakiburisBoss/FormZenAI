"use client";

import { useState } from "react";
import { toast } from "sonner";

type CopyLinkButtonProps = {
  formId: number | string;
  className?: string;
  isTemporary?: boolean;
};

export function CopyLinkButton({
  formId,
  className,
  isTemporary = false,
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    // Check if it's an anonymous/temporary form
    const isAnonymousForm =
      typeof formId === "string" && formId.startsWith("temp_");

    if (isAnonymousForm || isTemporary) {
      toast.warning("Sign up to share your forms!", {
        description: "Anonymous forms are stored locally and can't be shared",
        action: {
          label: "Sign Up",
          onClick: () => {
            window.location.href = "/auth";
          },
        },
      });
      return;
    }

    // Copy link for database forms
    const link = `${window.location.origin}/forms/${formId}`;

    navigator.clipboard.writeText(link).then(
      () => {
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        console.error("Failed to copy:", err);
        toast.error("Failed to copy link");
      },
    );
  };

  // Check if it's an anonymous form
  const isAnonymousForm =
    typeof formId === "string" && formId.startsWith("temp_");

  return (
    <button
      onClick={handleCopyLink}
      className={className}
      title={
        isAnonymousForm || isTemporary
          ? "Sign up to share forms"
          : "Copy form link"
      }
    >
      {copied ? (
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Copied!
        </span>
      ) : (
        <span className="flex items-center gap-1">
          {isAnonymousForm || isTemporary ? (
            <>
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Share
            </>
          ) : (
            <>
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
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy Link
            </>
          )}
        </span>
      )}
    </button>
  );
}
