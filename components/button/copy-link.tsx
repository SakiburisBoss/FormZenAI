"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type CopyLinkButtonProps = {
  formId?: number | string;
  shareUrl?: string;
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "destructive"
    | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
};

export function CopyLinkButton({
  formId,
  shareUrl,
  className,
  variant = "default",
  size = "sm",
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const link = shareUrl
      ? `${window.location.origin}/submit/${shareUrl}`
      : `${window.location.origin}/forms/${formId}`;

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

  return (
    <Button
      onClick={handleCopyLink}
      className={className}
      variant={variant}
      size={size}
      title="Copy form link"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4 mr-2" />
          Copy Link
        </>
      )}
    </Button>
  );
}
