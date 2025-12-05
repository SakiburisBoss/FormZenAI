"use client";
import { MAX_FREE_FORMS } from "@/lib/utils";
import Link from "next/link";
import React, { useState } from "react";
import GenerateFormInput from "../form/GenerateFormInput";
import { Button } from "../ui/button";

type SuggestionText = {
  label: string;
  text: string;
};

const suggestionBtnText: SuggestionText[] = [
  {
    label: "Job Application",
    text: "Develop a basic job application form that serves as a one-page solution form collecting essential information from applicants.",
  },
  {
    label: "Registration Form",
    text: "Create a course registration form suitable form any scheool or instituition.",
  },
  {
    label: "Feedback Form",
    text: "Create a client feedback form to gather valuable insights from any clients.",
  },
];

type Props = {
  totalForms: number;
  isSubscribed: boolean;
};

const HeroSection: React.FC<Props> = ({ totalForms, isSubscribed }) => {
  const [text, setText] = useState<string>("");

  return (
    <section className="w-full max-w-6xl mx-auto space-y-12">
      <div className="relative space-y-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 blur-3xl opacity-60 -z-10 rounded-full"></div>

        <div className="text-center space-y-4 px-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Build AI-Driven Forms Effortlessly
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Leverage the power of AI to create responsive and dynamic forms in
            minutes
          </p>
        </div>

        <div className="max-w-3xl mx-auto px-4">
          <GenerateFormInput
            text={text}
            totalForms={totalForms}
            isSubscribed={isSubscribed}
          />
        </div>

        {!isSubscribed && (
          <div className="text-center space-y-2 px-4">
            <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
              You have {MAX_FREE_FORMS - totalForms} free forms remaining
            </p>
            <Link
              className="inline-block text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline underline-offset-4 transition-all"
              href="/pricing"
            >
              Upgrade to premium for unlimited forms →
            </Link>
          </div>
        )}
      </div>

      <div className="space-y-4 px-4">
        <h2 className="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Quick Start Templates
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {suggestionBtnText.map((item: SuggestionText, index: number) => (
            <Button
              key={index}
              onClick={() => setText(item.text)}
              variant="outline"
              className="group relative h-auto py-4 px-6 rounded-xl border-2 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1 bg-white dark:bg-gray-900"
            >
              <span className="font-semibold text-base text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.label}
              </span>
              <svg
                className="w-5 h-5 inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Button>
          ))}
        </div>
      </div>

      <div className="pt-8 border-t border-gray-200 dark:border-gray-800 px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 md:gap-16">
          <div className="text-center space-y-1">
            <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              10K+
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Forms Created
            </div>
          </div>

          <div className="hidden sm:block w-px h-16 bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>

          <div className="text-center space-y-1">
            <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {MAX_FREE_FORMS}
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Free Forms Monthly
            </div>
          </div>

          <div className="hidden sm:block w-px h-16 bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>

          <div className="text-center space-y-1">
            <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              5K+
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Happy Users
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
