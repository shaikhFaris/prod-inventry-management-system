import dotenv from "dotenv";
import z from "zod";
import logger from "../utils/logger";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.literal(["dev", "prod"]),
  PORT: z.coerce.number(),
  DB_URL: z.url(),
});

const res = envSchema.safeParse(process.env);
if (!res.success) {
  logger.error("ENV var invalid\n" + res.error.message);
  process.exit(1);
}
logger.info("ENV vars valid.");

export const env = res.data;
