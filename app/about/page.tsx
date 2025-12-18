import { getTotalFormsOfUser } from "@/actions/forms/total-forms-of-user";
import { getUser } from "@/actions/user/get-user";
import GenerateFormInput from "@/components/form/GenerateFormInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Github,
  Globe,
  Heart,
  Mail,
  Share2,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "About - Form Zen AI",
  description:
    "Learn about Form Zen AI, the AI-powered form builder that makes creating and managing forms effortless.",
};

async function AboutPageContent() {
  const user = await getUser();
  const totalForms = user ? await getTotalFormsOfUser(user.id) : 0;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="relative text-center space-y-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 blur-3xl opacity-60 -z-10 rounded-full"></div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Form Builder
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About Form Zen AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Revolutionizing form creation with artificial intelligence. Build
            professional forms in seconds, not hours.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="border-2 hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                To democratize form creation by leveraging AI technology, making
                it accessible and effortless for everyone. We believe creating
                forms should be as simple as describing what you need.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                To become the world's most intuitive form builder, powered by
                AI. We envision a future where anyone can create professional,
                engaging forms without technical knowledge or design skills.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Why Choose Form Zen AI?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We combine cutting-edge AI with an intuitive interface to deliver
              the best form-building experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Generate professional forms in seconds using natural language.
                  Just describe what you need, and AI does the rest.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-300 dark:hover:border-purple-700 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>AI-Powered</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Leveraging advanced AI to understand your requirements and
                  generate optimized form structures automatically.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-300 dark:hover:border-green-700 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
                  <Share2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Easy Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Share your forms instantly with a unique link. No
                  configuration needed, just copy and share.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-orange-300 dark:hover:border-orange-700 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-3">
                  <BarChart3 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle>Real-time Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track submissions in real-time. See who's filling out your
                  forms and monitor response rates instantly.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your data is encrypted and secure. We prioritize privacy and
                  never share your information with third parties.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-pink-300 dark:hover:border-pink-700 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                </div>
                <CardTitle>Always Free</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get 15 free forms with full features. No credit card required,
                  no hidden fees, just pure form-building power.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-2xl p-8 md:p-12 border-2 border-blue-200 dark:border-blue-800">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Creating forms has never been easier. Follow these simple steps:
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Describe Your Form
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Type what kind of form you need in plain English. Our AI
                  understands your requirements.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  AI Generates Form
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Watch as AI creates your form instantly with appropriate
                  fields, labels, and structure.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Publish & Share
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Review, customize if needed, publish your form, and share the
                  link instantly.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Key Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to create, manage, and track your forms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex items-start gap-4 p-6 rounded-xl bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                  Natural Language Input
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Just describe your form in plain English and let AI do the
                  work.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                  Instant Publishing
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Publish your forms with one click and get a shareable link
                  immediately.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                  Response Tracking
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Monitor all submissions in real-time with detailed analytics.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                  Draft & Edit
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Save forms as drafts and edit them anytime before publishing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                  Anonymous Support
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Try it out without signing up. Create forms anonymously.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                  OAuth Integration
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Sign in with Google or GitHub for a seamless experience.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-8 md:p-12 border-2 border-gray-200 dark:border-slate-700">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <Globe className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <Heart className="w-8 h-8 text-pink-600 dark:text-pink-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Built for Everyone
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Whether you're a student collecting survey responses, a business
              gathering customer feedback, or an event organizer managing
              registrations, Form Zen AI is designed to meet your needs.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
              <div className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                Students
              </div>
              <div className="px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium">
                Businesses
              </div>
              <div className="px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium">
                Event Organizers
              </div>
              <div className="px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-medium">
                Educators
              </div>
              <div className="px-4 py-2 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 font-medium">
                Researchers
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 blur-3xl opacity-60 -z-10 rounded-2xl"></div>
          <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-2xl">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Join thousands of users who are already creating amazing forms
                with Form Zen AI. Start building your first form today!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                {user ? (
                  <GenerateFormInput totalForms={totalForms} />
                ) : (
                  <>
                    <Button
                      asChild
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <Link href="/auth">
                        <Sparkles className="w-5 h-5 mr-2" />
                        Get Started Free
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <Link href="/">Try Without Signing Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="border-t-2 border-gray-200 dark:border-slate-700 pt-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Get in Touch
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Have questions or feedback? We'd love to hear from you!
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  asChild
                  variant="outline"
                  className="hover:bg-blue-50 dark:hover:bg-blue-950"
                >
                  <Link
                    href="mailto:iamsakibur@gmail.com"
                    className="flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Contact Support
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="hover:bg-purple-50 dark:hover:bg-purple-950"
                >
                  <Link
                    href="https://github.com/SakiburisBoss"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    View on GitHub
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AboutPageContent />
    </Suspense>
  );
}
