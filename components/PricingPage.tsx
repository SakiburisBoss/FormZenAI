"use client";
import { Check, Crown, Sparkles, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

type Props = {
  userId: string | undefined;
  currentPlan?: string;
};

type Plan = {
  name: string;
  slug: string;
  price: string;
  priceMonthly: string;
  description: string;
  features: string[];
  productId: string;
  popular?: boolean;
  icon: React.ReactNode;
  gradient: string;
};

const plans: Plan[] = [
  {
    name: "Free",
    slug: "FREE",
    price: "$0",
    priceMonthly: "Forever free",
    description: "Perfect for trying out Form Zen AI",
    features: [
      "8 Free Forms per month",
      "Basic AI form generation",
      "Form submissions tracking",
      "Community support",
      "Basic templates",
    ],
    productId: "",
    icon: <Sparkles className="w-6 h-6" />,
    gradient: "from-gray-500 to-gray-600",
  },
  {
    name: "Pro",
    slug: "PRO",
    price: "$9",
    priceMonthly: "per month",
    description: "For professionals and growing teams",
    features: [
      "Unlimited forms",
      "Advanced AI form generation",
      "Priority form processing",
      "Advanced analytics",
      "Custom branding",
      "Email support",
      "Export submissions",
      "Integration APIs",
    ],
    productId: "90782d4d-c02c-4578-88b3-be4d36dde0a8",
    popular: true,
    icon: <Zap className="w-6 h-6" />,
    gradient: "from-blue-500 to-purple-600",
  },
  {
    name: "Enterprise",
    slug: "ENTERPRISE",
    price: "$29",
    priceMonthly: "per month",
    description: "For large organizations with advanced needs",
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Advanced security features",
      "Custom AI model training",
      "Dedicated account manager",
      "24/7 Priority support",
      "Custom integrations",
      "SLA guarantee",
      "White-label solution",
    ],
    productId: "f8cf99ba-d481-40a2-9605-d97192640cb8",
    icon: <Crown className="w-6 h-6" />,
    gradient: "from-purple-600 to-pink-600",
  },
];

const PricingPage: React.FC<Props> = ({ userId, currentPlan = "FREE" }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: Plan) => {
    // If user not logged in, redirect to sign in
    if (!userId) {
      toast.error("Please sign in to upgrade your plan");
      router.push("/sign-in");
      return;
    }

    // If it's the free plan, do nothing
    if (plan.slug === "FREE") {
      toast.info("You're already on the free plan");
      return;
    }

    // If user is already on this plan
    if (currentPlan === plan.slug) {
      toast.info(`You're already subscribed to the ${plan.name} plan`);
      return;
    }

    setLoading(plan.slug);

    try {
      // Use Polar's checkout - the auth.ts already has the checkout configured
      // We'll use Better Auth's Polar checkout endpoint
      const checkoutUrl = `/api/auth/polar/checkout/${plan.slug.toLowerCase()}`;

      // Redirect to Polar checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout. Please try again.");
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Upgrade or downgrade
            anytime.
          </p>
          {currentPlan && currentPlan !== "FREE" && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
              <Check className="w-4 h-4" />
              Current Plan: {currentPlan}
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.slug}
              className={`relative flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                plan.popular
                  ? "border-2 border-blue-500 dark:border-blue-400 shadow-xl"
                  : "border-2"
              } ${
                plan.slug === "ENTERPRISE"
                  ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white border-purple-500"
                  : ""
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="px-4 py-1 text-xs font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg">
                    🔥 MOST POPULAR
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pt-8">
                {/* Icon */}
                <div
                  className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center text-white shadow-lg`}
                >
                  {plan.icon}
                </div>

                <CardTitle className="text-2xl font-bold">
                  {plan.name}
                </CardTitle>
                <CardDescription
                  className={
                    plan.slug === "ENTERPRISE"
                      ? "text-gray-300"
                      : "text-gray-600 dark:text-gray-400"
                  }
                >
                  {plan.description}
                </CardDescription>

                {/* Price */}
                <div className="mt-6">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-extrabold">
                      {plan.price}
                    </span>
                  </div>
                  <p
                    className={`mt-1 text-sm ${
                      plan.slug === "ENTERPRISE"
                        ? "text-gray-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {plan.priceMonthly}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="flex-1 pt-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 rounded-full p-0.5 ${
                          plan.slug === "ENTERPRISE"
                            ? "bg-purple-500"
                            : "bg-green-500"
                        }`}
                      >
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span
                        className={`text-sm ${
                          plan.slug === "ENTERPRISE"
                            ? "text-gray-200"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-6">
                <Button
                  onClick={() => handleCheckout(plan)}
                  disabled={loading === plan.slug || currentPlan === plan.slug}
                  className={`w-full h-12 text-base font-semibold transition-all duration-300 ${
                    plan.slug === "ENTERPRISE"
                      ? "bg-white text-gray-900 hover:bg-gray-100"
                      : plan.popular
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                        : ""
                  } ${
                    currentPlan === plan.slug
                      ? "opacity-60 cursor-not-allowed"
                      : ""
                  }`}
                  variant={
                    plan.slug === "ENTERPRISE" || plan.popular
                      ? "default"
                      : "outline"
                  }
                >
                  {loading === plan.slug ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : currentPlan === plan.slug ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Current Plan
                    </>
                  ) : plan.slug === "FREE" ? (
                    "Get Started Free"
                  ) : (
                    `Upgrade to ${plan.name}`
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-20 text-center space-y-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Need help choosing a plan?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            All plans include a 14-day money-back guarantee. Cancel anytime, no
            questions asked. Need a custom plan?{" "}
            <a
              href="mailto:support@formzen.ai"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Contact us
            </a>
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 pt-16 border-t border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">99.9%</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Uptime Guarantee
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-600">10K+</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Happy Customers
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-pink-600">24/7</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Support Available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
