import type { RequestHandler } from "express";
import z from "zod";
import { ApiError } from "../../utils/ApiError";
import { updateItem } from "./item-services";
import { updateItemSchema } from "./item-schema";

type UpdateItembody = z.infer<typeof updateItemSchema>;

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
