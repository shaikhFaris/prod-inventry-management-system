import { db } from "../../db/drizzle";
import { ApiError } from "../../utils/ApiError";
import {
  findProductByIdLock,
  updateProductStockById,
} from "../products/product-repository";
import {
  deleteItemById,
  getItemByIdForUserLocked,
  updateItemStockById,
} from "./item-repository";

export const updateItem = async (
  userId: string,
  itemmId: string,
  orderId: string,
  adjustment: number,
) => {
  return await db.transaction(async (tx) => {
    // entire is transaction locks that item row
    const item = await getItemByIdForUserLocked(userId, itemmId, orderId, tx);
    if (!item) throw new ApiError(404, "Item not found for user");

    const currentItemStock = item.item.quantity;
    const updatedItemStock = currentItemStock + adjustment;

    // there must be atleast 1 quantity in the update remaining. for 0 delete the item.
    if (updatedItemStock <= 0)
      throw new ApiError(
        409,
        "The minimum quantity of an item must be one. Remove the item if you want it to zero.",
      );

    adjustment = adjustment * -1;
    const productId = item.item.productId;
    // update the product stock also
    // the product selet must be locked to prevent another race condition
    const product = await findProductByIdLock(productId, tx);

    if (!product) throw new ApiError(404, "Product not found");

    const stock = product.stock;
    const updatedStock = stock + adjustment;

    if (updatedStock < 0)
      throw new ApiError(409, `Adjustment not possible. Stock: ${stock}`);

    await updateProductStockById(productId, updatedStock, tx);

    return await updateItemStockById(itemmId, updatedItemStock, tx);
  });
};

export const deleteItem = async (userId: string, itemId: string, orderId: string) => {
  return await db.transaction(async (tx) => {
    const item = await getItemByIdForUserLocked(userId, itemId, orderId, tx);
    if (!item) throw new ApiError(404, "Item not found for user");

    const productId = item.item.productId;
    const product = await findProductByIdLock(productId, tx);

    if (!product) throw new ApiError(404, "Product not found");

    const stock = product.stock;
    const updatedStock = stock + item.item.quantity;

    if (updatedStock < 0)
      throw new ApiError(409, `Adjustment not possible. Stock: ${stock}`);

    const deletedItem = await deleteItemById(itemId, tx);
    await updateProductStockById(productId, updatedStock, tx);

    return deletedItem;
  });
};
