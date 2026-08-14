import express, { type Router } from "express";
import { authRoutes } from "../modules/auth/auth-routes";
import { productRoutes } from "../modules/products/products-routes";
import { orderRoutes } from "../modules/orders/orders-routes";
import { authenticateTokens } from "../middleware/authenticate-tokens";

const v1Routes: Router = express.Router();

v1Routes.use("/auth", authRoutes);
v1Routes.use("/products", authenticateTokens, productRoutes);
v1Routes.use("/orders", authenticateTokens, orderRoutes);

export { v1Routes };
