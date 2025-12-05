"use cache";

import prisma from "@/lib/prisma";

export const getTotalFormsOfUser = async (userId: string) => {
  const totalForms = await prisma.form.count({
    where: {
      ownerId: userId,
    },
  });
  return totalForms;
};
