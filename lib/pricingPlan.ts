export type PricingPlan = {
  level: string;
  price: string;
  services: string[];
};

export const pricingPlan: PricingPlan[] = [
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
