import { PrismaClient } from "@prisma/client";
import { defineEventHandler, H3Event, createError } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id);

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

    const deletedProduct = await prisma.product.delete({
      where: { id },
    });

    return {
      status: "success",
      data: deletedProduct,
    };
  } catch (error: any) {
    return createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
