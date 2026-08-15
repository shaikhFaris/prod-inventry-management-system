import express, { type Router } from "express";
import { validate } from "../../utils/validate";
import { createOrderSchema } from "./order-schema";
import {
  handleCreateOrder,
  handleGetAllOrder,
  handleGetOrderDetails,
} from "./order-controller";
import { idempotent } from "../../middleware/idempotent";

const orderRoutes: Router = express.Router();

orderRoutes.get("/", handleGetAllOrder);
orderRoutes.get("/:id", handleGetOrderDetails);
orderRoutes.post("/", idempotent, validate(createOrderSchema), handleCreateOrder);

export { orderRoutes };
