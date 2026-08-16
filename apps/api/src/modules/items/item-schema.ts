import z from "zod";

export const updateItemSchema = z.object({
  body: z.strictObject({
    orderId: z.uuid(),
    adjustment: z.number().refine((v) => v !== 0, "Adjustment cannot be zero"),
  }),
});

export const deleteItemSchema = z.object({
  body: z.strictObject({
    orderId: z.uuid(),
  }),
});

export const updateItemByAgentSchema = z.object({
  body: z.strictObject({
    orderId: z.uuid(),
    userId: z.uuid(),
  }),
});
