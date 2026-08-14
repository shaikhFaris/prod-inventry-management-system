import type { EmptyRelations } from "drizzle-orm";
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
