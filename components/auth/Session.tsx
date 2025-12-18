"use client";
import { useEffect } from "react";

export default function EnsureAnonymousSession() {
  useEffect(() => {
    fetch("/api/auth/ensure-anonymous", { method: "POST" });
  }, []);
  return null;
}
