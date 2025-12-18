"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function ServerActionToast({ error }: { error?: string }) {
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return null;
}
