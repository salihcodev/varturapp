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

    // Check if the product exists
    const productExists = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!productExists) {
      throw createError({ statusCode: 404, statusMessage: "Product not found" });
    }

    // Check if the category exists
    const categoryExists = await prisma.category.findUnique({
      where: {
        id: Number(formData.category_id),
      },
    });

    if (!categoryExists) {
      throw createError({ statusCode: 404, statusMessage: "Category not found" });
    }

    // Update the product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: formData.name,
        picture: fileUrl,
        category_id: Number(formData.category_id),
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
