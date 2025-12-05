import { getTotalFormsOfUser } from "@/actions/forms/total-forms-of-user";
import { getUser } from "@/actions/user/getUser";
import HeroSection from "@/components/section/HeroSection";
import { Suspense } from "react";

const HomePageContent = async () => {
  const user = await getUser();

  // Handle case when user is not available
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-lg font-medium text-gray-600 dark:text-gray-400">
          Connecting as anonymous...
        </div>
      </div>
    );
  }

  const totalForms = await getTotalFormsOfUser(user.id);

  const isSubscribed =
    user !== null &&
    user !== undefined &&
    (user.subscription === "PRO" || user.subscription === "ENTERPRISE") &&
    !user.isAnonymous;

  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <HeroSection totalForms={totalForms} isSubscribed={isSubscribed} />
    </div>
  );
};

export default async function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
