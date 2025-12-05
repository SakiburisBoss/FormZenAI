"use cache: private";

import { auth, type User } from "@/lib/auth";
import { headers } from "next/headers";

export const getUser = async (): Promise<User | undefined> => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    const anonymousSession = await auth.api.signInAnonymous({
      headers: await headers(),
    });
    return anonymousSession?.user as User | undefined;
  }
  return session.user;
};
