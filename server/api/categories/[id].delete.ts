import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id);

    if (isNaN(id)) {
      throw createError({ statusCode: 400, statusMessage: "Invalid ID format" });
    }

    // Check if the category exists
    const categoryExists = await prisma.category.findUnique({
      where: {
        id: id,
      },
    });

    if (!categoryExists) {
      throw createError({ statusCode: 404, statusMessage: "Category not found" });
    }

    const deletedCategory = await prisma.category.delete({
      where: { id },
    });

    return {
      status: "success",
      statusMessage: "Category successfully deleted",
      data: deletedCategory,
    };
  } catch (error: any) {
    return createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
