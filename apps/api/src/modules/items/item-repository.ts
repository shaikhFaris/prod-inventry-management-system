import { and, eq, type EmptyRelations } from "drizzle-orm";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { PgAsyncTransaction } from "drizzle-orm/pg-core";
import { orders, ordersItems, orderStatusEnum } from "../../db/schema/schema";

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

type ItemStatus = (typeof orderStatusEnum.enumValues)[number];

export const updateItemStatusById = async (
  itemId: string,
  status: ItemStatus,
  tx: PgAsyncTransaction<NodePgQueryResultHKT, EmptyRelations>,
) => {
  return await tx
    .update(ordersItems)
    .set({
      status: status,
      updatedAt: new Date(),
    })
    .where(eq(ordersItems.id, itemId))
    .returning();
};

export const deleteItemById = async (
  itemId: string,
  tx: PgAsyncTransaction<NodePgQueryResultHKT, EmptyRelations>,
) => {
  return await tx
    .update(ordersItems)
    .set({
      status: "cancelled",
    })
    .where(eq(ordersItems.id, itemId))
    .returning();
};

export const getItemByAgentIdLocked = async (
  agentId: string,
  itemId: string,
  tx: PgAsyncTransaction<NodePgQueryResultHKT, EmptyRelations>,
) => {
  return (
    await tx
      .select()
      .from(ordersItems)
      .where(and(eq(ordersItems.id, itemId), eq(ordersItems.agentId, agentId)))
      .for("update")
  )[0];
};
