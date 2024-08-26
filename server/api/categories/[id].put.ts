import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id);
    const formData = event.context.formData || {};
    const fileUrl = event.context.fileUrl;

    if (isNaN(id)) {
      throw createError({ statusCode: 400, statusMessage: "Invalid ID format" });
    }

    // Attempt to update the category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: formData.name,
        picture: fileUrl,
        parent_id: formData.parent_id ? Number(formData.parent_id) : null,
      },
    });

    return {
      status: "OK",
      data: updatedCategory,
    };
  } catch (error: any) {
    if (error.code === "P2025") {
      // on the flay check with prisma :)
      // Prisma error code for "Record to update not found"
      return createError({
        statusCode: 404,
        statusMessage: "Category not found",
      });
    }

    return createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
