import { getUser } from "@/actions/user/getUser";
import { CopyLinkButton } from "@/components/button/copy-link";
import prisma from "@/lib/prisma";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Forms</h1>
          <p className="text-gray-600">
            Manage your draft forms, published forms, and view submissions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Draft Forms</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {formsCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-600"
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
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Published Forms
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {publishedFormsCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Submissions
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {submissionsCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* All Forms Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              All Forms ({allForms.length})
            </h2>
          </div>

          {allForms.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-600 mb-4">No forms yet</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Create Your First Form
              </Link>
            </div>
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
                  <div
                    key={form.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {content.formTitle}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          isPublished
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {content.formFields?.length || 0} fields
                    </p>
                    {isPublished && (
                      <p className="text-sm text-gray-600 mb-2">
                        {submissionCount} submissions
                      </p>
                    )}
                    <div className="text-xs text-gray-500 mb-4">
                      Created {new Date(form.createdAt).toLocaleDateString()}
                    </div>

                    {isPublished ? (
                      <div className="flex gap-2">
                        <Link
                          href={`/forms/${form.id}`}
                          className="flex-1 text-center px-4 py-2 bg-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          View
                        </Link>
                        <CopyLinkButton
                          formId={form.id}
                          className="flex-1 text-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                        />
                      </div>
                    ) : (
                      <Link
                        href={`/forms/${form.id}/edit`}
                        className="block w-full text-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                      >
                        Edit & Publish
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Submissions Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Recent Submissions ({submissionsCount})
            </h2>
          </div>

          {submissionsCount === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
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
              <p className="text-gray-600 mb-2">No submissions yet</p>
              <p className="text-sm text-gray-500">
                Submissions will appear here when users fill out your published
                forms
              </p>
            </div>
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
                  <div
                    key={submission.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {formContent.formTitle || "Untitled Form"}
                          </h3>
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            #{submission.id}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Submitted{" "}
                          {new Date(submission.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Preview of submission data */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                      {Object.entries(content)
                        .slice(0, 4)
                        .map(([key, value]) => (
                          <div key={key} className="space-y-1">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              {key.replace(/_/g, " ")}
                            </p>
                            <p className="text-sm text-gray-900 truncate">
                              {typeof value === "string" &&
                              value.startsWith("http") ? (
                                <a
                                  href={value}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
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
                        <div className="text-sm text-gray-500 italic">
                          +{Object.keys(content).length - 4} more fields
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {submissionsCount > 10 && (
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    Showing 10 of {submissionsCount} submissions
                  </p>
                </div>
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
    <Suspense fallback={<div>Loading...</div>}>
      <FormsWrapper />
    </Suspense>
  );
}
