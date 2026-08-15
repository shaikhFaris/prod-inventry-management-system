import { and, eq, type EmptyRelations } from "drizzle-orm";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { PgAsyncTransaction } from "drizzle-orm/pg-core";
import { db } from "../../db/drizzle";
import { orders, ordersItems } from "../../db/schema/schema";

export const getItemByIdForUserLocked = async (
  userId: string,
  itemId: string,
  orderId: string,
  tx: PgAsyncTransaction<NodePgQueryResultHKT, EmptyRelations>,
) => {
  return (
    await tx
      .select({
        item: ordersItems,
      })
      .from(orders)
      .innerJoin(ordersItems, eq(orders.id, ordersItems.orderId))
      .where(
        and(
          eq(orders.id, orderId),
          eq(orders.userId, userId),
          eq(ordersItems.id, itemId),
        ),
      )
      .for("update")
  )[0];
};

export const updateItemStockById = async (
  itemId: string,
  stock: number,
  tx: PgAsyncTransaction<NodePgQueryResultHKT, EmptyRelations>,
) => {
  return await tx
    .update(ordersItems)
    .set({
      quantity: stock,
      updatedAt: new Date(),
    })
    .where(eq(ordersItems.id, itemId))
    .returning();
};
