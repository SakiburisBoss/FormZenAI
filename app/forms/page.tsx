import { getUser } from "@/actions/user/get-user";
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

const FormsContent = async ({ userId }: { userId: string }) => {
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
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl opacity-75 group-hover:opacity-100 transition-opacity blur-sm"></div>
              <Card className="relative border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Published Forms
                  </CardTitle>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    {publishedFormsCount}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Live and collecting responses
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl opacity-75 group-hover:opacity-100 transition-opacity blur-sm"></div>
              <Card className="relative border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Submissions
                  </CardTitle>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-800 bg-clip-text text-transparent">
                    {submissionsCount}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total responses received
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {allForms.length < MAX_FREE_FORMS && (
            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800">
              <div className="flex-1 text-center">
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  You have {MAX_FREE_FORMS - allForms.length} of{" "}
                  {MAX_FREE_FORMS} free forms remaining
                </p>
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
                  <GenerateFormInput totalForms={allForms.length} />
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allForms.map((form) => {
                const content = (form.content ?? {}) as {
                  formTitle?: string;
                  formFields?: Array<Record<string, any>>;
                };
                const submissionCount = submissions.filter(
                  (sub) => sub.formId === form.id,
                ).length;
                const isPublished = form.published;

                const gradients = [
                  "from-pink-500 to-rose-500",
                  "from-purple-500 to-indigo-500",
                  "from-blue-500 to-cyan-500",
                  "from-green-500 to-emerald-500",
                  "from-yellow-500 to-orange-500",
                  "from-red-500 to-pink-500",
                ];
                const gradient = gradients[form.id % gradients.length];

                return (
                  <Card
                    key={form.id}
                    className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-300 dark:hover:border-blue-700"
                  >
                    <div
                      className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${gradient}`}
                    ></div>

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-bold mb-1 truncate">
                            {content?.formTitle || "Untitled Form"}
                          </CardTitle>
                          <CardDescription className="line-clamp-2 text-xs">
                            {(content?.formFields?.length ?? 0) > 0
                              ? `${content?.formFields?.length} fields`
                              : "No description"}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={isPublished ? "default" : "secondary"}
                          className={
                            isPublished
                              ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 shrink-0"
                              : "shrink-0"
                          }
                        >
                          {isPublished ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Live
                            </>
                          ) : (
                            <>
                              <Edit3 className="w-3 h-3 mr-1" />
                              Draft
                            </>
                          )}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 pb-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Inbox className="w-4 h-4" />
                          <span className="font-medium">
                            {submissionCount}{" "}
                            {submissionCount === 1 ? "response" : "responses"}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(form.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {isPublished && (
                        <div className="pt-2">
                          <CopyLinkButton
                            shareUrl={form.shareUrl}
                            variant="outline"
                            size="sm"
                            className="w-full"
                          />
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="pt-3 gap-2 border-t">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="flex-1 hover:bg-blue-50 dark:hover:bg-blue-950"
                      >
                        <Link href={`/forms/${form.id}/edit`}>
                          <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                          Edit
                        </Link>
                      </Button>
                      {isPublished && (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="flex-1 hover:bg-purple-50 dark:hover:bg-purple-950"
                        >
                          <Link
                            href={`/forms/${form.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1.5" />
                            View
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

        {submissions.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Recent Submissions
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Latest responses from your forms
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {submissions.slice(0, 5).map((submission) => {
                const content = submission.content as Record<string, string>;
                const formContent = (submission.form.content ?? {}) as {
                  formTitle?: string;
                };

                const gradients = [
                  "from-blue-500 to-cyan-500",
                  "from-purple-500 to-pink-500",
                  "from-green-500 to-emerald-500",
                  "from-orange-500 to-red-500",
                  "from-indigo-500 to-purple-500",
                ];
                const gradient = gradients[submission.id % gradients.length];

                return (
                  <Card
                    key={submission.id}
                    className="hover:shadow-lg transition-shadow flex flex-col"
                  >
                    <CardHeader className="pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-semibold truncate">
                          {formContent?.formTitle ?? "Untitled Form"}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1 break-words">
                          Submitted on{" "}
                          {new Date(submission.createdAt).toLocaleString()}
                        </CardDescription>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${gradient} text-white shrink-0`}
                      >
                        New
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(content)
                          .slice(0, 3)
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm"
                            >
                              <FileText className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0 break-words">
                                <span className="font-medium text-muted-foreground">
                                  {key}:{" "}
                                </span>
                                <span className="text-foreground">
                                  {String(value)}
                                </span>
                              </div>
                            </div>
                          ))}
                        {Object.keys(content).length > 3 && (
                          <p className="text-xs text-muted-foreground italic">
                            +{Object.keys(content).length - 3} more fields
                          </p>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="pt-3 border-t">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Link href={`/forms/${submission.formId}/edit`}>
                          View Full Submission
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {submissions.length > 5 && (
              <div className="text-center mt-4">
                <Button variant="outline" asChild>
                  <Link href="/forms">View All Submissions</Link>
                </Button>
              </div>
            )}
          </div>
        )}

        {submissionsCount === 0 && allForms.length > 0 && (
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center mb-4">
                <Inbox className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="mb-2 text-xl">No submissions yet</CardTitle>
              <CardDescription className="text-center max-w-md">
                Share your published forms to start collecting responses
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
  if (!user) {
    throw new Error("User not found");
  }
  const userId = user.id;

  return <FormsContent userId={userId} />;
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
