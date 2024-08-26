import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const formData = event.context.formData || {};
    const fileUrl = event.context.fileUrl;

    const category = await prisma.category.create({
      data: {
        name: formData.name,
        picture: fileUrl,
        parent_id: formData.parent_id ? Number(formData.parent_id) : null,
      },
    });

    return {
      status: "OK",
      data: category,
    };
  } catch (error: any) {
    return createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
