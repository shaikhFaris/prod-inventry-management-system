import express, { type Router } from "express";
import { validate } from "../../utils/validate";
import { authenticateRole } from "../../middleware/validate-role";
import { productSchema, updateProductSchema } from "./product-schema";
import {
  handleCreateProduct,
  handleDeleteProduct,
  handleGetAllProducts,
  handleGetProductDetails,
  handleUpdateProduct,
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

export { productRoutes };
