import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

type RequireAuthProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  redirectTo?: string;
  prevURL?: string;
};

export default function RequireAuth({
  title = "Authentication Required",
  description = "You must be signed in to access this feature. Please log in to continue and manage your forms securely.",
  actionLabel = "Sign In",
  redirectTo = "/auth?callbackURL=/forms",
  prevURL,
}: RequireAuthProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl border bg-background p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>

        <h1 className="text-xl font-semibold tracking-tight">
          {title}
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        <div className="mt-6 space-y-4">
          <Link href={redirectTo}>
            <Button className="w-full">
              {actionLabel}
            </Button>
          </Link>
          {prevURL && (
            <Link
              href={prevURL}
              className="inline-flex items-center gap-1 text-sm font-medium
                         bg-gradient-to-r from-indigo-500 to-sky-500
                         bg-clip-text text-transparent
                         hover:from-indigo-600 hover:to-sky-600"
            >
              ← Go back
            </Link>
          )}

        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Don’t have an account yet? You can create one during sign in.
        </p>
      </div>
    </div>
  );
}