import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id);

    if (isNaN(id)) {
      throw createError({ statusCode: 400, statusMessage: "Invalid ID format" });
    }

    // Check if the product exists
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw createError({ statusCode: 404, statusMessage: "Product not found" });
    }

    return {
      status: "success",
      data: product,
    };
  } catch (error: any) {
    return createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
