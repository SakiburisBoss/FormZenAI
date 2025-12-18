import { getTotalFormsOfUser } from "@/actions/forms/total-forms-of-user";
import { getUser } from "@/actions/user/get-user";
import HeroSection from "@/components/section/HeroSection";
import { Suspense } from "react";

const HomePageContent = async () => {
  const user = await getUser();
  const totalForms = await getTotalFormsOfUser(user?.id);

  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <HeroSection totalForms={totalForms} />
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
