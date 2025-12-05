"use client";
import { signIn, signInSocial, signUp } from "@/actions/auth-actions";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { GithubIcon } from "../icons/github";
import { GoogleIcon } from "../icons/google";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

const AuthClientPage = ({ callbackURL }: { callbackURL: string }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [signInState, signInAction, isSignInPending] = useActionState(
    signIn,
    null,
  );
  const [signUpState, signUpAction, isSignUpPending] = useActionState(
    signUp,
    null,
  );
  const state = isSignIn ? signInState : signUpState;
  const formAction = isSignIn ? signInAction : signUpAction;
  const isPending = isSignIn ? isSignInPending : isSignUpPending;

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);
  const handleSocialAuth = async (
    provider: "google" | "github",
    callbackURL: string,
  ) => {
    setIsLoading(true);

    try {
      await signInSocial(provider, callbackURL);
    } catch (err) {
      toast.error(
        `Error authenticating with ${provider}: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isSignIn ? "Welcome Back!" : "Create an Account"}
          </CardTitle>
          <CardDescription>
            {isSignIn
              ? "Welcome back! Please sign in to your account."
              : "Join us today! Create an account to get started."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button
              onClick={async () => {
                await handleSocialAuth("google", callbackURL);
              }}
              variant="outline"
              className="w-full"
              disabled={isLoading || isPending}
            >
              <GoogleIcon /> Continue with Google
            </Button>
            <Button
              onClick={async () => {
                await handleSocialAuth("github", callbackURL);
              }}
              variant={"outline"}
              className="w-full"
              disabled={isLoading || isPending}
            >
              <GithubIcon /> Continue with GitHub
            </Button>
          </div>
          <Separator className="my-6 text-center  text-sm  text-muted-foreground">
            Or continue with
          </Separator>
          <form action={formAction} className="grid gap-3">
            {!isSignIn && (
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Enter Your Name"
                  required
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                name="email"
                placeholder="Enter Your Email"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                name="password"
                placeholder="Enter Your Password"
                required
              />
            </div>
            <Button
              type="submit"
              className="mt-4 w-full"
              disabled={isPending || isLoading}
            >
              {isSignIn ? "Sign In" : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <Button
            variant="link"
            className="w-fit mx-auto no-underline hover:no-underline"
            onClick={() => setIsSignIn(!isSignIn)}
            type="button"
          >
            {isSignIn ? (
              <>
                Don't have an account?{" "}
                <span className="text-blue-500 underline">Sign Up</span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span className="underline text-blue-500">Sign In</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
export default AuthClientPage;
