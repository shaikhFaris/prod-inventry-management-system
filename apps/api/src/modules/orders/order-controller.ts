import type { RequestHandler } from "express";
import type z from "zod";
import { createOrderSchema } from "./order-schema";
import { createOrder } from "./order-services";
import { ApiError } from "../../utils/ApiError";

type CreateOrderBody = z.infer<typeof createOrderSchema>;

export const handleCreateOrder: RequestHandler = async (req, res) => {
  const {
    body: { items },
  } = req as CreateOrderBody;
  const userId = req.user?.id;
  const key = req.headers["idempotency-key"] as string;
  if (!userId)
    throw new ApiError(
      500,
      "Please authenticate",
      "req.user.id is not added by the authenticate token middleware",
    );

  const result = await createOrder(items, userId, key);
  res.status(200).json(result);
};
