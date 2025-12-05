import { getUser } from "@/actions/user/getUser";
import { CopyLinkButton } from "@/components/button/copy-link";
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
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import {
  CheckCircle2,
  Edit3,
  Eye,
  FileText,
  Inbox,
  PenLine,
} from "lucide-react";
import { cacheTag } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";

const FormsContent = async ({ userId }: { userId: string }) => {
  "use cache";
  cacheTag("user-forms", userId);

  const [allForms, submissions] = await Promise.all([
    // Get all forms (both draft and published)
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Forms</h1>
          <p className="text-muted-foreground">
            Manage your draft forms, published forms, and view submissions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Forms</CardTitle>
              <PenLine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formsCount}</div>
              <p className="text-xs text-muted-foreground">
                Unpublished forms ready to edit
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Published Forms
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedFormsCount}</div>
              <p className="text-xs text-muted-foreground">
                Live forms collecting responses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Submissions
              </CardTitle>
              <Inbox className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissionsCount}</div>
              <p className="text-xs text-muted-foreground">
                Responses received from users
              </p>
            </CardContent>
          </Card>
        </div>

        {/* All Forms Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              All Forms ({allForms.length})
            </h2>
          </div>

          {allForms.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <CardTitle className="mb-2">No forms yet</CardTitle>
                <CardDescription className="mb-4">
                  Get started by creating your first AI-generated form
                </CardDescription>
                <Button asChild>
                  <Link href="/">Create Your First Form</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allForms.map((form) => {
                const content =
                  typeof form.content === "string"
                    ? JSON.parse(form.content)
                    : form.content;
                const submissionCount = form.submissions || 0;
                const isPublished = form.published;

                return (
                  <Card key={form.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="line-clamp-2">
                          {content.formTitle}
                        </CardTitle>
                        <Badge variant={isPublished ? "default" : "secondary"}>
                          {isPublished ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <CardDescription>
                        {content.formFields?.length || 0} fields
                        {isPublished && ` • ${submissionCount} submissions`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-xs text-muted-foreground">
                        Created {new Date(form.createdAt).toLocaleDateString()}
                      </p>
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
                        <Button asChild className="w-full" size="sm">
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

        <Separator className="my-8" />

        {/* Submissions Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              Recent Submissions ({submissionsCount})
            </h2>
          </div>

          {submissionsCount === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Inbox className="h-16 w-16 text-muted-foreground mb-4" />
                <CardTitle className="mb-2">No submissions yet</CardTitle>
                <CardDescription>
                  Submissions will appear here when users fill out your
                  published forms
                </CardDescription>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => {
                const content =
                  typeof submission.content === "string"
                    ? JSON.parse(submission.content)
                    : submission.content;
                const formContent =
                  typeof submission.form.content === "string"
                    ? JSON.parse(submission.form.content)
                    : submission.form.content;

                return (
                  <Card key={submission.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-lg">
                              {formContent.formTitle || "Untitled Form"}
                            </CardTitle>
                            <Badge variant="outline">#{submission.id}</Badge>
                          </div>
                          <CardDescription>
                            Submitted{" "}
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
                            <div key={key} className="space-y-1">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                {key.replace(/_/g, " ")}
                              </p>
                              <p className="text-sm truncate">
                                {typeof value === "string" &&
                                value.startsWith("http") ? (
                                  <a
                                    href={value}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    View File →
                                  </a>
                                ) : (
                                  String(value)
                                )}
                              </p>
                            </div>
                          ))}
                        {Object.keys(content).length > 4 && (
                          <div className="text-sm text-muted-foreground italic">
                            +{Object.keys(content).length - 4} more fields
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {submissionsCount > 10 && (
                <Card>
                  <CardContent className="py-4">
                    <p className="text-sm text-muted-foreground text-center">
                      Showing 10 of {submissionsCount} submissions
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

async function FormsWrapper() {
  const user = await getUser();
  const userId = user!.id;
  return <FormsContent userId={userId} />;
}

export default function FormsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your forms...</p>
          </div>
        </div>
      }
    >
      <FormsWrapper />
    </Suspense>
  );
}
