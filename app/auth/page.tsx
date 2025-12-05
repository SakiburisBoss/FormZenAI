import AuthClientPage from "@/components/auth/AuthClientPage";
import { headers } from "next/headers";
import { Suspense } from "react";

const AuthContent = async () => {
  let referer = (await headers()).get("referer");
  if (!referer) {
    return (referer = "/");
  }
  const callbackURL = new URL(referer).pathname;
  return <AuthClientPage callbackURL={callbackURL} />;
};
export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
