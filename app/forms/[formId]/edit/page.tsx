import AiGeneratedForm from "@/components/form/AIGeneratedForm";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/lib/generated/prisma/client";
import prisma from "@/lib/prisma";

const Edit = async ({ params }: { params: Promise<{ formId: string }> }) => {
  "use cache";
  const formId = (await params).formId;

  if (!formId) {
    return <h1>No form id found for id {formId}</h1>;
  }

  const form: Form | null = await prisma.form.findUnique({
    where: {
      id: Number(formId),
    },
  });

  if (!form) {
    return <h1>Form not found</h1>;
  }

  return (
    <Card>
      <CardContent>
        <AiGeneratedForm form={form} isEditMode={true} />
      </CardContent>
    </Card>
  );
};
export default Edit;
