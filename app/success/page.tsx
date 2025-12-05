import { getUser } from "@/actions/user/getUser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const SuccessPageContent = async ({
  searchParams,
}: {
  searchParams: { checkout_id?: string };
}) => {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const checkoutId = searchParams.checkout_id;
  const isPro = user.subscription === "PRO";
  const isEnterprise = user.subscription === "ENTERPRISE";
  const planName = isPro ? "Pro" : isEnterprise ? "Enterprise" : "Free";

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 mb-6 animate-bounce">
            <Check className="w-12 h-12 text-white" strokeWidth={3} />
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Payment Successful!
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Welcome to Form Zen AI {planName}
          </p>

          {checkoutId && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Checkout ID: {checkoutId}
            </p>
          )}
        </div>

        <Card className="border-2 border-green-200 dark:border-green-800 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              {isEnterprise ? (
                <Crown className="w-6 h-6 text-purple-600" />
              ) : (
                <Sparkles className="w-6 h-6 text-blue-600" />
              )}
              <CardTitle className="text-2xl">
                Your {planName} Plan is Active
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                What's included in your plan:
              </h3>
              <ul className="space-y-3">
                {(isPro || isEnterprise) && (
                  <>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full p-0.5 bg-green-500">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        Unlimited form creation
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full p-0.5 bg-green-500">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        Advanced AI form generation
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full p-0.5 bg-green-500">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        Priority form processing
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full p-0.5 bg-green-500">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        Advanced analytics & insights
                      </span>
                    </li>
                  </>
                )}
                {isEnterprise && (
                  <>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full p-0.5 bg-purple-500">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        Dedicated account manager
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full p-0.5 bg-purple-500">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        24/7 Priority support
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full p-0.5 bg-purple-500">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        Custom integrations & white-label
                      </span>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                What's next?
              </h3>
              <ol className="space-y-2 list-decimal list-inside text-gray-700 dark:text-gray-300">
                <li>Start creating unlimited AI-powered forms</li>
                <li>Explore advanced features and analytics</li>
                <li>Check your email for your receipt and welcome guide</li>
                {isEnterprise && (
                  <li>Your account manager will contact you within 24 hours</li>
                )}
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                asChild
                className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
              >
                <Link href="/">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Create Your First Form
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 h-12 font-semibold"
              >
                <Link href="/forms">View Your Forms</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const SuccessPageSkeleton = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto animate-pulse" />
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse max-w-md mx-auto" />
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse max-w-xs mx-auto" />
        </div>
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
      </div>
    </div>
  );
};

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { checkout_id?: string };
}) {
  return (
    <Suspense fallback={<SuccessPageSkeleton />}>
      <SuccessPageContent searchParams={searchParams} />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: "Payment Successful - Form Zen AI",
  description: "Your payment was successful. Welcome to Form Zen AI!",
};
