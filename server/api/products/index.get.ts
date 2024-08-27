import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });

    const { _count } = await prisma.product.aggregate({
      _count: true,
    });

    return {
      status: "OK",
      statusMessage: "Successful fetch",
      data: products,
      results: _count,
    };
  } catch (error: any) {
    return createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
