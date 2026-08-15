import { z } from "zod";

const orderItemSchema = z.strictObject({
  productId: z.uuid(),
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

export const createOrderSchema = z.object({
  body: z.strictObject({
    items: z.array(orderItemSchema).min(1, "At least one order item is required"),
  }),
});

export const getAllOrdersParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});
