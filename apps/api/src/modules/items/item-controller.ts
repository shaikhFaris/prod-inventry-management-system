import type { RequestHandler } from "express";
import z from "zod";
import { ApiError } from "../../utils/ApiError";
import { agentUpdatesItemStatus, deleteItem, updateItem } from "./item-services";
import {
  deleteItemSchema,
  updateItemByAgentSchema,
  updateItemSchema,
} from "./item-schema";

type UpdateItembody = z.infer<typeof updateItemSchema>;
type DeleteItembody = z.infer<typeof deleteItemSchema>;
type UpdateItembodyBYAgent = z.infer<typeof updateItemByAgentSchema>;

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

export const handleItemUpdateAgent: RequestHandler = async (req, res) => {
  const agentId = req.user?.id as string;
  // itemID
  const valid = z.uuid().safeParse(req.params.id);

  const {
    body: { orderId, userId },
  } = req as UpdateItembodyBYAgent;

  if (!valid.success) {
    throw new ApiError(400, "Invalid item ID");
  }
  const updatedItem = await agentUpdatesItemStatus(userId, agentId, orderId, valid.data);
  res.json(updatedItem);
};
