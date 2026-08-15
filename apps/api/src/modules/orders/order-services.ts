import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { db } from "../../db/drizzle";
import { ApiError } from "../../utils/ApiError";
import {
  findProductByIdLock,
  updateProductStockById,
} from "../products/product-repository";
import {
  getAllOrders,
  getItemsForOrder,
  insertOrder,
  insertOrderItem,
} from "./order-repository";
import type { PgAsyncTransaction } from "drizzle-orm/pg-core";
import type { EmptyRelations } from "drizzle-orm";
import { redis } from "../../redis";
import logger from "../../utils/logger";

type Item = {
  productId: string;
  quantity: number;
};

type CreateOrder =
  | {
      productId: string;
      success: true;
    }
  | {
      success: false;
      errorMsg: string;
    };

// also need to make this idempotnet for retries
export const createOrder = async (items: Item[], userId: string, key: string) => {
  const result = await db.transaction(async (tx) => {
    const order = (await insertOrder(userId, tx))[0];
    if (!order) throw new ApiError(500, `Order could not be created`);

    let orderItems: CreateOrder[] = [];
    for (const item of items) {
      orderItems.push(await addItemsToOrder(item, order.id, tx));
    }

    const isAllFailled = !orderItems.some((el) => el.success === true);
    if (isAllFailled)
      throw new ApiError(409, "Order could not be placed because all items failed.");
    return orderItems;
  });
  try {
    // if this fails, then idempotency fails as well. in prod I would have logged this LOUDER
    await redis.set(`idempotency:orders:${key}`, JSON.stringify(result), "EX", 60, "NX");
  } catch (error) {
    logger.error(error);
  } finally {
    return result;
  }
};

export const addItemsToOrder = async (
  item: Item,
  orderId: string,
  tx: PgAsyncTransaction<NodePgQueryResultHKT, EmptyRelations>,
): Promise<CreateOrder> => {
  try {
    return await tx.transaction(async (tx2) => {
      const product = await findProductByIdLock(item.productId, tx2);
      if (!product) throw new ApiError(404, "Product not found");

      const stock = product.stock;
      const updatedStock = stock - item.quantity;

      if (updatedStock < 0)
        throw new ApiError(409, `Adjustment not possible. Stock: ${stock}`);

      await updateProductStockById(product.id, updatedStock, tx2);

      await insertOrderItem(orderId, product.id, product.price, item.quantity, tx2);

      return { success: true, productId: product.id };
    });
  } catch (err) {
    if (err instanceof ApiError) {
      return {
        success: false,
        errorMsg: err.message,
      };
    }
    return {
      success: false,
      errorMsg: "Couldnt add this item.",
    };
  }
};

export const getOrders = async (userId: string, limit: number, page: number) => {
  const orders = await getAllOrders(userId, limit, page);
  if (orders.length === 0) return [];

  const orderIds: string[] = orders.map((el) => el.id);
  return await getItemsForOrder(orderIds);
};
