import { getUser } from "@/actions/user/getUser";
import { CopyLinkButton } from "@/components/button/copy-link";
import GenerateFormInput from "@/components/form/GenerateFormInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { MAX_FREE_FORMS } from "@/lib/utils";
import {
  CheckCircle2,
  Edit3,
  Eye,
  FileText,
  Inbox,
  PenLine,
  Plus,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { cacheTag } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";

const FormsContent = async ({
  userId,
  isSubscribed,
}: {
  userId: string;
  isSubscribed: boolean;
}) => {
  "use cache";
  cacheTag("user-forms", userId);

  const [allForms, submissions] = await Promise.all([
    prisma.form.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.submissions.findMany({
      where: { form: { ownerId: userId } },
      include: { form: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const draftForms = allForms.filter((form) => !form.published);
  const publishedForms = allForms.filter((form) => form.published);
  const formsCount = draftForms.length;
  const publishedFormsCount = publishedForms.length;
  const submissionsCount = await prisma.submissions.count({
    where: { form: { ownerId: userId } },
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 blur-3xl opacity-60 -z-10 rounded-full"></div>

          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Forms Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Manage your AI-generated forms, track submissions, and share with
              the world
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl opacity-75 group-hover:opacity-100 transition-opacity blur-sm"></div>
              <Card className="relative border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Draft Forms
                  </CardTitle>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <PenLine className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                    {formsCount}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ready to edit and publish
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl opacity-75 group-hover:opacity-100 transition-opacity blur-sm"></div>
              <Card className="relative border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Published Forms
                  </CardTitle>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                    {publishedFormsCount}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Live and collecting responses
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl opacity-75 group-hover:opacity-100 transition-opacity blur-sm"></div>
              <Card className="relative border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Submissions
                  </CardTitle>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    {submissionsCount}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Responses from your forms
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {!isSubscribed && (
            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border border-orange-200 dark:border-orange-800">
              <div className="flex-1 text-center">
                <p className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                  You have {MAX_FREE_FORMS - allForms.length} of{" "}
                  {MAX_FREE_FORMS} free forms remaining
                </p>
                <Link
                  href="/pricing"
                  className="text-xs text-orange-600 dark:text-orange-400 hover:underline mt-1 inline-block"
                >
                  Upgrade to Pro for unlimited forms →
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                All Forms
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {allForms.length} form{allForms.length !== 1 ? "s" : ""} total
              </p>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
            >
              <Link href="/">
                <Plus className="w-4 h-4 mr-2" />
                Create New Form
              </Link>
            </Button>
          </div>

          {allForms.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="mb-2 text-2xl">
                  No forms yet! Let's create one
                </CardTitle>
                <CardDescription className="mb-6 text-center max-w-md">
                  Start by describing your form in plain text, and our AI will
                  generate a professional form instantly
                </CardDescription>
                <div className="w-full max-w-2xl">
                  <GenerateFormInput
                    totalForms={allForms.length}
                    isSubscribed={isSubscribed}
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allForms.map((form, index) => {
                const content =
                  typeof form.content === "string"
                    ? JSON.parse(form.content)
                    : form.content;
                const submissionCount = form.submissions || 0;
                const isPublished = form.published;

                // Gradient variations
                const gradients = [
                  "from-blue-500 to-cyan-500",
                  "from-purple-500 to-pink-500",
                  "from-orange-500 to-red-500",
                  "from-green-500 to-emerald-500",
                  "from-indigo-500 to-blue-500",
                  "from-pink-500 to-rose-500",
                ];
                const gradient = gradients[index % gradients.length];

                return (
                  <Card
                    key={form.id}
                    className="flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-2"
                  >
                    <div
                      className={`h-2 bg-gradient-to-r ${gradient} rounded-t-lg`}
                    ></div>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="line-clamp-2 text-lg">
                          {content.formTitle}
                        </CardTitle>
                        <Badge
                          variant={isPublished ? "default" : "secondary"}
                          className={
                            isPublished
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 border-0"
                              : ""
                          }
                        >
                          {isPublished ? "Live" : "Draft"}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        {content.formFields?.length || 0} fields
                        {isPublished && (
                          <>
                            <span>•</span>
                            <Inbox className="h-3 w-3" />
                            {submissionCount} submission
                            {submissionCount !== 1 ? "s" : ""}
                          </>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Created {new Date(form.createdAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                    <CardFooter className="gap-2">
                      {isPublished ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="flex-1"
                          >
                            <Link href={`/forms/${form.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </Button>
                          <CopyLinkButton formId={form.id} className="flex-1" />
                        </>
                      ) : (
                        <Button
                          asChild
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          size="sm"
                        >
                          <Link href={`/forms/${form.id}/edit`}>
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit & Publish
                          </Link>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {submissionsCount > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Inbox className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Recent Submissions
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {submissionsCount} total response
                  {submissionsCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {submissions.map((submission, index) => {
                const content =
                  typeof submission.content === "string"
                    ? JSON.parse(submission.content)
                    : submission.content;
                const formContent =
                  typeof submission.form.content === "string"
                    ? JSON.parse(submission.form.content)
                    : submission.form.content;

                const gradients = [
                  "from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950",
                  "from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950",
                  "from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950",
                  "from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950",
                ];
                const gradient = gradients[index % gradients.length];

                return (
                  <Card
                    key={submission.id}
                    className={`bg-gradient-to-br ${gradient} border-2 transition-all duration-300 hover:shadow-lg`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">
                              {formContent.formTitle || "Untitled Form"}
                            </CardTitle>
                            <Badge variant="outline" className="font-mono">
                              #{submission.id}
                            </Badge>
                          </div>
                          <CardDescription className="flex items-center gap-1">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {new Date(submission.createdAt).toLocaleString()}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(content)
                          .slice(0, 4)
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="p-3 rounded-lg bg-white/50 dark:bg-gray-900/50 border"
                            >
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                {key.replace(/_/g, " ")}
                              </p>
                              <p className="text-sm font-medium truncate">
                                {typeof value === "string" &&
                                value.startsWith("http") ? (
                                  <a
                                    href={value}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                  >
                                    View File
                                    <svg
                                      className="w-3 h-3"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                      />
                                    </svg>
                                  </a>
                                ) : (
                                  String(value)
                                )}
                              </p>
                            </div>
                          ))}
                        {Object.keys(content).length > 4 && (
                          <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-900/50 border flex items-center justify-center">
                            <p className="text-sm text-muted-foreground font-medium">
                              +{Object.keys(content).length - 4} more fields
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {submissionsCount > 10 && (
                <Card className="border-2 border-dashed">
                  <CardContent className="py-6">
                    <p className="text-sm text-muted-foreground text-center">
                      Showing 10 of {submissionsCount} submissions •{" "}
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        View all in analytics (coming soon)
                      </span>
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {submissionsCount === 0 && allForms.length > 0 && (
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center mb-4">
                <Inbox className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="mb-2">No submissions yet</CardTitle>
              <CardDescription className="text-center max-w-md">
                Once users start filling out your published forms, their
                responses will appear here in real-time
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

async function FormsWrapper() {
  const user = await getUser();
  const userId = user!.id;
  const isSubscribed =
    user !== null &&
    user !== undefined &&
    (user.subscription === "PRO" || user.subscription === "ENTERPRISE") &&
    !user.isAnonymous;

  return <FormsContent userId={userId} isSubscribed={isSubscribed} />;
}

export default function FormsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-800"></div>
              <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            </div>
            <div>
              <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Loading your forms...
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Please wait a moment
              </p>
            </div>
          </div>
        </div>
      }
    >
      <FormsWrapper />
    </Suspense>
  );
}
