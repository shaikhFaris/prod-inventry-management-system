import { desc, eq } from "drizzle-orm";
import { db } from "../../db/drizzle";
import { products } from "../../db/schema/schema";
import type { UpdateProductBody } from "./product-controller";

export const insertProduct = async ({
  stock,
  name,
  description,
  price,
}: {
  stock: number;
  name: string;
  description: string;
  price: number;
}) => {
  return await db
    .insert(products)
    .values({
      stock,
      description,
      name,
      price,
    })
    .returning();
};

export const findAllProducts = async (limit: number, pageNo: number) => {
  return await db
    .select()
    .from(products)
    .orderBy(desc(products.createdAt))
    .limit(limit)
    .offset((pageNo - 1) * limit);
};

export const findProductById = async (productId: string) => {
  return (await db.select().from(products).where(eq(products.id, productId)))[0];
};

export const updateProductById = async (
  productId: string,
  product: UpdateProductBody["body"],
) => {
  return await db
    .update(products)
    .set({
      ...product,
      updatedAt: new Date(),
    })
    .where(eq(products.id, productId))
    .returning();
};

export const deleteProductById = async (productId: string) => {
  return (await db.delete(products).where(eq(products.id, productId)).returning())[0];
};
