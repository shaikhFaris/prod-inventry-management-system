import type { RequestHandler } from "express";
import type z from "zod";
import { createOrderSchema, getAllOrdersParamsSchema } from "./order-schema";
import { createOrder, getOrders } from "./order-services";
import { ApiError } from "../../utils/ApiError";
import { DEFAULT_PAGE_NO, DEFAULT_PAGE_SIZE } from "../../constants/params";

type CreateOrderBody = z.infer<typeof createOrderSchema>;
export type GetAllOrdersParams = z.infer<typeof getAllOrdersParamsSchema>;

export const handleGetAllOrder: RequestHandler = async (req, res) => {
  const userId = req.user?.id as string; // this will be a string always because it is added in middlware
  const valid = getAllOrdersParamsSchema.safeParse(req.query);
  let params: GetAllOrdersParams;
  if (!valid.success) {
    params = {
      limit: DEFAULT_PAGE_SIZE,
      page: DEFAULT_PAGE_NO,
    };
  } else {
    params = valid.data;
  }

  const orders = await getOrders(userId, params.limit, params.page);

  return res.json(orders);
};

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
