import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const formData = event.context.formData || {};
    const fileUrl = event.context.fileUrl;

    const categoryId = Number(formData.category_id);

    if (isNaN(categoryId)) {
      throw createError({ statusCode: 400, statusMessage: "Invalid category ID format" });
    }

    // Check if the category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      throw createError({ statusCode: 404, statusMessage: "Category not found" });
    }

    // Create the product if the category exists
    const product = await prisma.product.create({
      data: {
        name: formData.name,
        picture: fileUrl,
        category_id: categoryId,
      },
    });

    return {
      status: "OK",
      data: product,
    };
  } catch (error: any) {
    return createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
