
import { signIn, signInSocial, signUp } from "@/actions/auth-actions";
import { GithubIcon } from "@/components/icons/github";
import { GoogleIcon } from "@/components/icons/google";
import ServerActionToast from "@/components/ServerActionToast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function AuthPage({
  searchParams,
}: {
  searchParams?: Promise<{
    error?: string;
    mode?: "signin" | "signup";
    callbackURL?: string;
  }>;
}) {
  const mode = (await searchParams)?.mode ?? "signin";
  const error = (await searchParams)?.error;
  const callbackURL = (await searchParams)?.callbackURL ?? "/";

  return (
    <>
   <ServerActionToast error={error} />
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription>
            {mode === "signin"
              ? "Sign in to your account"
              : "Create a new account"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">    
          {/* Social login */}
          <div className="space-y-2">
            <form
              action={async () => {
                "use server";
                await signInSocial("google", callbackURL );
              }}
            >
              <Button variant="outline" className="w-full">
                <GoogleIcon /> Continue with Google
              </Button>
            </form>

            <form
              action={async () => {
                "use server";
                await signInSocial("github", callbackURL );
              }}
            >
              <Button variant="outline" className="w-full">
                <GithubIcon /> Continue with GitHub
              </Button>
            </form>
          </div>

          {/* Divider */}
          <div className="text-center text-sm text-muted-foreground">
            or continue with email
          </div>

          {/* SIGN IN */}
          {mode === "signin" && (
            <form action={signIn} className="grid gap-3">
              <input type="hidden" name="callbackURL" value={callbackURL } />
              <div>
                <Label>Email</Label>
                <Input name="email" type="email" required />
              </div>

              <div>
                <Label>Password</Label>
                <Input name="password" type="password" required />
              </div>

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          )}

          {/* SIGN UP */}
          {mode === "signup" && (
            <form action={signUp} className="grid gap-3">
              <input type="hidden" name="callbackURL" value={callbackURL } />
              <div>
                <Label>Name</Label>
                <Input name="name" required />
              </div>

              <div>
                <Label>Email</Label>
                <Input name="email" type="email" required />
              </div>

              <div>
                <Label>Password</Label>
                <Input name="password" type="password" required />
              </div>

              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          {mode === "signin" ? (
            <Link href="/auth?mode=signup">
              Don’t have an account?{" "}
              <span className="font-extrabold  text-blue-500 underline">
                Sign Up
              </span>
            </Link>
          ) : (
            <Link href="/auth?mode=signin">
              Already have an account?{" "}
              <span className="font-extrabold  text-blue-500 underline">
                Sign In
              </span>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
    </>
  );
}
