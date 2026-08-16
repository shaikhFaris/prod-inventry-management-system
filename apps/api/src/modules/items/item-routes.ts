import express, { type Router } from "express";
import {
  handleItemDelete,
  handleItemUpdate,
  handleItemUpdateAgent,
} from "./item-controller";
import { validate } from "../../utils/validate";
import {
  deleteItemSchema,
  updateItemByAgentSchema,
  updateItemSchema,
} from "./item-schema";
import { authenticateRole } from "../../middleware/validate-role";

const itemRoutes: Router = express.Router();

// item updation used by the user to update items in a order
itemRoutes.patch("/:id", validate(updateItemSchema), handleItemUpdate);
itemRoutes.delete("/:id", validate(deleteItemSchema), handleItemDelete);
itemRoutes.patch(
  "/:id/delivered",
  authenticateRole("agent"),
  validate(updateItemByAgentSchema),
  handleItemUpdateAgent,
);

export { itemRoutes };
