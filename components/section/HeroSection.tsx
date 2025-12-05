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
    <section className="w-full max-w-6xl mx-auto space-y-8">
      <div className="relative space-y-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 blur-3xl opacity-60 -z-10 rounded-full"></div>

        <div className="text-center space-y-6 px-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Build AI-Driven Forms Effortlessly
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Create, publish, and manage smart forms with AI. Collect responses,
            track submissions, and share forms instantly—all in one platform.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              AI-Powered Generation
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                />
              </svg>
              Instant Publishing
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Real-time Analytics
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-medium">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Easy Sharing
            </div>
          </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 py-8">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200 dark:border-blue-800">
          <div className="w-12 h-12 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
            AI Form Generation
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Describe your form in plain text and let AI generate professional,
            field-perfect forms instantly with smart input types.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border border-purple-200 dark:border-purple-800">
          <div className="w-12 h-12 rounded-xl bg-purple-600 dark:bg-purple-500 flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
            Draft & Edit
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Save forms as drafts, edit fields, customize layouts, and publish
            when ready. Full control over your form design.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800">
          <div className="w-12 h-12 rounded-xl bg-green-600 dark:bg-green-500 flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
            Collect Submissions
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Receive form responses in real-time, view all submissions, and track
            analytics including file uploads via Cloudinary.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border border-orange-200 dark:border-orange-800">
          <div className="w-12 h-12 rounded-xl bg-orange-600 dark:bg-orange-500 flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </div>
          <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
            Share Anywhere
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Get unique shareable links for each form. One-click copy and share
            with unlimited respondents. No login required.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
