import { desc, eq, type EmptyRelations } from "drizzle-orm";
import { db } from "../../db/drizzle";
import { products } from "../../db/schema/schema";
import type { UpdateProductBody } from "./product-controller";
import type { PgAsyncTransaction } from "drizzle-orm/pg-core";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";

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

export const findProductByIdLock = async (
  productId: string,
  tx: PgAsyncTransaction<NodePgQueryResultHKT, EmptyRelations>,
) => {
  return (
    await tx.select().from(products).where(eq(products.id, productId)).for("update")
  )[0];
};

export const updateProductStockById = async (
  productId: string,
  stock: number,
  tx?: PgAsyncTransaction<NodePgQueryResultHKT, EmptyRelations>,
) => {
  const pool = tx ?? db;
  return await pool
    .update(products)
    .set({
      stock,
      updatedAt: new Date(),
    })
    .where(eq(products.id, productId))
    .returning();
};
