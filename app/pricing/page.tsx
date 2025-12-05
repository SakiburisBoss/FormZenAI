import { getUser } from "@/actions/user/getUser";
import PricingPage from "@/components/PricingPage";
import type { Metadata } from "next";
import { Suspense } from "react";

const PricingPageContent = async () => {
  const user = await getUser();

  return (
    <PricingPage userId={user?.id} currentPlan={user?.subscription || "FREE"} />
  );
};

const PricingPageSkeleton = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse max-w-2xl mx-auto" />
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse max-w-xl mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[600px] bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<PricingPageSkeleton />}>
      <PricingPageContent />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: "Pricing - Form Zen AI",
  description:
    "Choose the perfect plan for your needs. Simple, transparent pricing with no hidden fees.",
};
