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
