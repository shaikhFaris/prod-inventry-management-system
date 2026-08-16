import { and, desc, eq, inArray, type EmptyRelations } from "drizzle-orm";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { PgAsyncTransaction } from "drizzle-orm/pg-core";
import { db } from "../../db/drizzle";
import { orders, ordersItems, orderStatusEnum } from "../../db/schema/schema";
import type z from "zod";

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

export const getOrderDetails = async (
  userId: string,
  orderId: string,
  tx?: PgAsyncTransaction<NodePgQueryResultHKT, EmptyRelations>,
) => {
  const pool = tx ?? db;
  return (
    await db
      .select()
      .from(orders)
      .where(and(eq(orders.userId, userId), eq(orders.id, orderId)))
  )[0];
};

export const getOrderDetailsLocked = async (
  userId: string,
  orderId: string,
  tx: PgAsyncTransaction<NodePgQueryResultHKT, EmptyRelations>,
) => {
  return (
    await tx
      .select()
      .from(orders)
      .where(and(eq(orders.userId, userId), eq(orders.id, orderId)))
      .for("update")
  )[0];
};

export const getItemsForOrder = async (
  orderIds: string[],
  tx?: PgAsyncTransaction<NodePgQueryResultHKT, EmptyRelations>,
) => {
  const pool = tx ?? db;

  return await pool
    .select()
    .from(ordersItems)
    .where(inArray(ordersItems.orderId, orderIds));
};

type OrderStatus = (typeof orderStatusEnum.enumValues)[number];

export const updateOrderStatus = async (
  status: OrderStatus,
  orderId: string,
  tx: PgAsyncTransaction<NodePgQueryResultHKT, EmptyRelations>,
) => {
  return await tx
    .update(orders)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))
    .returning();
};
