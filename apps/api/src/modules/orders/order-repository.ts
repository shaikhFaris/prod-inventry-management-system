import { desc, eq, inArray, type EmptyRelations } from "drizzle-orm";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { PgAsyncTransaction } from "drizzle-orm/pg-core";
import { db } from "../../db/drizzle";
import { orders, ordersItems } from "../../db/schema/schema";

export const insertOrder = async (
  userId: string,
  tx?: PgAsyncTransaction<NodePgQueryResultHKT, EmptyRelations>,
) => {
  const pool = tx ?? db;
  return await pool
    .insert(orders)
    .values({
      userId,
    })
    .returning();
};

export const insertOrderItem = async (
  orderId: string,
  productId: string,
  price: number,
  quantity: number,
  tx?: PgAsyncTransaction<NodePgQueryResultHKT, EmptyRelations>,
) => {
  const pool = tx ?? db;
  return await pool.insert(ordersItems).values({
    orderId,
    productId,
    price,
    quantity,
  });
};

export const getAllOrders = async (userId: string, limit: number, page: number) => {
  console.log(limit);
  return await db
    .select({ id: orders.id })
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);
};

export const getItemsForOrder = async (orderIds: string[]) => {
  return await db
    .select()
    .from(ordersItems)
    .where(inArray(ordersItems.orderId, orderIds));
};
