import { ApiError } from "../../utils/ApiError";
import type { UpdateProductBody } from "./product-controller";
import {
  deleteProductById,
  findAllProducts,
  findProductById,
  insertProduct,
  updateProductById,
} from "./product-repository";

export const createProduct = async (product: {
  stock: number;
  name: string;
  description: string;
  price: number;
}) => {
  return await insertProduct(product);
};

export const getProducts = async (limit: number, pageNo: number) => {
  return await findAllProducts(limit, pageNo);
};

export const getProductDetails = async (productId: string) => {
  const product = await findProductById(productId);
  if (!product) throw new ApiError(404, "Product does not exist");
  return product;
};

export const updateProduct = async (
  productId: string,
  product: UpdateProductBody["body"],
) => {
  const existingProduct = await findProductById(productId);
  if (!existingProduct) throw new ApiError(404, "Product does not exist");

  const updatedProduct = await updateProductById(productId, product);
  return updatedProduct[0];
};

export const deleteProduct = async (productId: string) => {
  const product = await deleteProductById(productId);
  if (!product) throw new ApiError(404, "Product not found");
};
