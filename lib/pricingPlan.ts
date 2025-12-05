export type PricingPlan = {
  name: string;
  slug: string;
  price: string;
  priceMonthly: string;
  description: string;
  features: string[];
  productId: string;
  popular?: boolean;
  gradient: string;
};

export const pricingPlans: PricingPlan[] = [
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
    productId: "c24ea16e-2ac8-42b4-945c-86ec7df65357",
    popular: true,
    gradient: "from-blue-500 to-purple-600",
  },
  {
    name: "Enterprise",
    slug: "ENTERPRISE",
    price: "$19.99",
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
    productId: "6181ba61-ba3d-473b-9334-c32a9a68438f",
    gradient: "from-purple-600 to-pink-600",
  },
];

// Legacy export for backward compatibility
export const pricingPlan = [
  {
    level: "Free",
    price: "$0/month",
    services: [
      "8 Free Forms",
      "Basic Supports",
      "Limited Features",
      "Community Access",
    ],
  },
  {
    level: "Pro",
    price: "$9",
    services: [
      "Unlimited Credits",
      "Basic Supports",
      "Limited Features",
      "Community Access",
    ],
  },
  {
    level: "Enterprise",
    price: "$29",
    services: [
      "Unlimited Credits",
      "Basic Supports",
      "Limited Features",
      "Community Access",
      "Monthly Updates",
    ],
  },
];
