import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id);

    if (isNaN(id)) {
      throw createError({ statusCode: 400, statusMessage: "Invalid ID format" });
    }

    const deletedCategory = await prisma.category.delete({
      where: { id },
    });

    return {
      status: "OK",
      data: deletedCategory,
    };
  } catch (error: any) {
    return createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
