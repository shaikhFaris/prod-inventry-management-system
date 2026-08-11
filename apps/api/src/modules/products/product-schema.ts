import { z } from "zod";

export const productSchema = z.object({
  body: z.strictObject({
    stock: z.number().int().nonnegative(),
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().positive(),
  }),
});

export const updateProductSchema = z.object({
  body: z
    .strictObject({
      name: z.string().min(1, "Name is required").optional(),
      description: z.string().min(1, "Description is required").optional(),
      price: z.number().positive().optional(),
    })
    .refine((body) => Object.values(body).some((value) => value !== undefined), {
      message: "At least one field is required",
    }),
});

export const updateStockSchema = z.object({
  body: z.strictObject({
    adjustment: z.number().refine((v) => v !== 0, "Adjustment cannot be zero"),
  }),
});

export const getAllProductsParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});
