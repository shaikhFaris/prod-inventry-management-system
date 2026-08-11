import express, { type Router } from "express";
import { validate } from "../../utils/validate";
import { authenticateRole } from "../../middleware/validate-role";
import { productSchema, updateProductSchema, updateStockSchema } from "./product-schema";
import {
  handleCreateProduct,
  handleDeleteProduct,
  handleGetAllProducts,
  handleGetProductDetails,
  handleGetProductStock,
  handleUpdateProduct,
  handleUpdateProductStock,
} from "./product-controller";

const productRoutes: Router = express.Router();

productRoutes.post(
  "/",
  authenticateRole("admin"),
  validate(productSchema),
  handleCreateProduct,
);

productRoutes.get("/", handleGetAllProducts);

productRoutes.get("/:id", handleGetProductDetails);

productRoutes.patch(
  "/:id",
  authenticateRole("admin"),
  validate(updateProductSchema),
  handleUpdateProduct,
);

productRoutes.delete("/:id", handleDeleteProduct);

productRoutes.get("/:id/stock", handleGetProductStock);

productRoutes.patch(
  "/:id/stock/adjust",
  validate(updateStockSchema),
  handleUpdateProductStock,
);

export { productRoutes };
