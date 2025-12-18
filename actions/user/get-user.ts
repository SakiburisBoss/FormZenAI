"use cache: private";

import type { User } from "@/lib/auth";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getUser(): Promise<User | null | undefined> {
  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs });
  return session?.user as User | null;
}
