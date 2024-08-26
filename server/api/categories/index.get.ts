import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

interface CategoryWithChildren
  extends Prisma.CategoryGetPayload<{
    include: {
      children: true;
      _count: {
        select: {
          products: true;
        };
      };
    };
  }> {
  childrenCount: number;
  productCount: number;
}

export default defineEventHandler(async (event) => {
  try {
    const categories = await prisma.category.findMany({
      where: { parent_id: null },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
        children: {
          include: {
            _count: {
              select: {
                products: true,
              },
            },
            children: {
              include: {
                _count: {
                  select: {
                    products: true,
                  },
                },
                children: {
                  include: {
                    _count: {
                      select: {
                        products: true,
                      },
                    },
                    children: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const countChildren = (category: any): number => {
      if (!category.children || category.children.length === 0) {
        return 0;
      }
      return (
        category.children.length +
        category.children.reduce((acc: any, child: any) => acc + countChildren(child), 0)
      );
    };

    const categoriesWithDetails = categories.map((category) => {
      const mappedCategory: CategoryWithChildren = {
        ...category,
        childrenCount: countChildren(category),
        productCount: category._count.products,
        children: category.children.map((child) => ({
          ...child,
          childrenCount: countChildren(child),
          productCount: child._count.products,
          children: child.children.map((grandchild) => ({
            ...grandchild,
            childrenCount: countChildren(grandchild),
            productCount: grandchild._count.products,
            children: grandchild.children.map((greatGrandchild) => ({
              ...greatGrandchild,
              childrenCount: countChildren(greatGrandchild as CategoryWithChildren),
              productCount: greatGrandchild._count.products,
            })),
          })),
        })),
      };
      return mappedCategory;
    });

    const { _count } = await prisma.category.aggregate({
      _count: true,
    });

    return {
      status: "OK",
      data: categoriesWithDetails,
      results: _count,
    };
  } catch (error: any) {
    return createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
