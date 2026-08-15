import express, { type Router } from "express";
import { handleItemUpdate } from "./item-controller";
import { validate } from "../../utils/validate";
import { updateItemSchema } from "./item-schema";

const itemRoutes: Router = express.Router();

// item updation used by the user to update items in a order
itemRoutes.patch("/:id", validate(updateItemSchema), handleItemUpdate);

export { itemRoutes };
