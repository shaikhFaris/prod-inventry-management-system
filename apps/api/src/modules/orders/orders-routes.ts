import express, { type Router } from "express";
import { validate } from "../../utils/validate";
import { createOrderSchema } from "./order-schema";
import { handleCreateOrder } from "./order-controller";

const orderRoutes: Router = express.Router();

orderRoutes.post("/", validate(createOrderSchema), handleCreateOrder);

export { orderRoutes };
