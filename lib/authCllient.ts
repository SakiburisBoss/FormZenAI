import {
  anonymousClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: (
    (process.env.NEXT_PUBLIC_BETTER_AUTH_APP_URL as string) ||
    "http://localhost:3000"
  ).replace(/\/+$/, ""),
  plugins: [anonymousClient(), inferAdditionalFields<typeof auth>()],
});
