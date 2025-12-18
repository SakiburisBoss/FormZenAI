"use cache";

import prisma from "@/lib/prisma";

export const getTotalFormsOfUser = async (userId: string | undefined) => {
  const totalForms = await prisma.form.count({
    where: {
      ownerId: userId,
    },
  });
  return totalForms;
};
