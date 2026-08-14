import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["admin", "customer"]);

export const orderStatusEnum = pgEnum("status", ["processing", "delivered", "cancelled"]);

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  role: roleEnum().notNull().default("customer"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const refreshTokenTable = pgTable("refresh_token", {
  token: text("refresh_token"),
  userId: uuid("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .unique(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),

  stock: integer("stock").notNull().default(0),

  name: varchar("name", { length: 255 }).notNull(),

  description: text("description").notNull(),

  price: integer("price").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => usersTable.id, { onDelete: "restrict" })
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ordersItems = pgTable("orders_items", {
  id: uuid("id").defaultRandom().primaryKey(),

  quantity: integer("quantity").notNull(),

  orderId: uuid("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),

  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "restrict" })
    .notNull(),

  status: orderStatusEnum().notNull().default("processing"),
  price: integer("price").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
