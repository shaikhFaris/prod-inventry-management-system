import type { RequestHandler } from "express";
import {
  createProduct,
  deleteProduct,
  getProductDetails,
  getProducts,
  productStock,
  updateProduct,
  updateProductStock,
} from "./product-services";
import {
  getAllProductsParamsSchema,
  productSchema,
  updateProductSchema,
  updateStockSchema,
} from "./product-schema";
import z from "zod";
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NO } from "../../constants/params";
import { ApiError } from "../../utils/ApiError";

export type CreateProductBody = z.infer<typeof productSchema>;
export type UpdateProductBody = z.infer<typeof updateProductSchema>;
export type GetAllProductsParams = z.infer<typeof getAllProductsParamsSchema>;
export type UpdateProductStockBody = z.infer<typeof updateStockSchema>;

export const handleCreateProduct: RequestHandler = async (req, res) => {
  const { body } = req as CreateProductBody;
  const product = await createProduct(body);

  res.status(201).json(product);
};

export const handleGetAllProducts: RequestHandler = async (req, res) => {
  const valid = getAllProductsParamsSchema.safeParse(req.query);
  let params: GetAllProductsParams;
  if (!valid.success) {
    params = {
      limit: DEFAULT_PAGE_SIZE,
      page: DEFAULT_PAGE_NO,
    };
  } else {
    params = valid.data;
  }
  const products = await getProducts(params.limit, params.page);
  return res.json(products);
};

export const handleGetProductDetails: RequestHandler = async (req, res) => {
  const valid = z.uuid().safeParse(req.params.id);

  if (!valid.success) {
    throw new ApiError(400, "Invalid product ID");
  }
  const product = await getProductDetails(valid.data);

  return res.json(product);
};

export const handleUpdateProduct: RequestHandler = async (req, res) => {
  const valid = z.uuid().safeParse(req.params.id);

  if (!valid.success) {
    throw new ApiError(400, "Invalid product ID");
  }

  const { body } = req as UpdateProductBody;
  const product = await updateProduct(valid.data, body);

  return res.json(product);
};

export const handleDeleteProduct: RequestHandler = async (req, res) => {
  const valid = z.uuid().safeParse(req.params.id);

  if (!valid.success) {
    throw new ApiError(400, "Invalid product ID");
  }
  await deleteProduct(valid.data);
  return res.status(204).json();
};

export const handleGetProductStock: RequestHandler = async (req, res) => {
  const valid = z.uuid().safeParse(req.params.id);

  if (!valid.success) {
    throw new ApiError(400, "Invalid product ID");
  }
  const stock = await productStock(valid.data);

  return res.json({ stock });
};

export const handleUpdateProductStock: RequestHandler = async (req, res) => {
  const {
    body: { adjustment },
  } = req as UpdateProductStockBody;

  const valid = z.uuid().safeParse(req.params.id);
  if (!valid.success) {
    throw new ApiError(400, "Invalid product ID");
  }
  const updatedProduct = await updateProductStock(valid.data, adjustment);

  return res.json(updatedProduct);
};
