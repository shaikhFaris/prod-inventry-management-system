// THIS FILE IS FOR DRIZZLE KIT TOOLS TO WORK
import { defineConfig } from "drizzle-kit";
import { env } from "./src/config/validateEnvs";

export default defineConfig({
  out: "./drizzle",
  schema: ["./src/db/schema/*.ts"],
  dialect: "postgresql",
  dbCredentials: {
    // bun drizzle-kit migrate tool uses this url for db connection
    url: env.DB_URL,
  },
});
