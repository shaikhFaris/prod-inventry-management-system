import express, { type Router } from "express";
import { validate } from "../../utils/validate";

const productRoutes: Router = express.Router();

productRoutes.get("/", async (req, res) => {
  console.log(req?.user, req?.refreshToken);
  res.json({ message: "products" });
});

export { productRoutes };
