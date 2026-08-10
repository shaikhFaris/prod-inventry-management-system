import { db } from "../db/drizzle";
import { usersTable } from "../db/schema/schema";

export type Role = typeof usersTable.$inferSelect.role;
