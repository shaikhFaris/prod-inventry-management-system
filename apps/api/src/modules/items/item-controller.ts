import type { RequestHandler } from "express";
import z from "zod";
import { ApiError } from "../../utils/ApiError";
import { deleteItem, updateItem } from "./item-services";
import { deleteItemSchema, updateItemSchema } from "./item-schema";

type UpdateItembody = z.infer<typeof updateItemSchema>;
type DeleteItembody = z.infer<typeof deleteItemSchema>;

export const handleItemUpdate: RequestHandler = async (req, res) => {
  const userId = req.user?.id as string;
  // itemID
  const valid = z.uuid().safeParse(req.params.id);

  const {
    body: { orderId, adjustment },
  } = req as UpdateItembody;

  if (!valid.success) {
    throw new ApiError(400, "Invalid item ID");
  }
  const updatedItem = await updateItem(userId, valid.data, orderId, adjustment);
  res.json(updatedItem);
};

export const handleItemDelete: RequestHandler = async (req, res) => {
  const userId = req.user?.id as string;
  const valid = z.uuid().safeParse(req.params.id);

  const {
    body: { orderId },
  } = req as DeleteItembody;

  if (!valid.success) {
    throw new ApiError(400, "Invalid item ID");
  }
  const deletedItem = await deleteItem(userId, valid.data, orderId);
  res.json(deletedItem);
};
