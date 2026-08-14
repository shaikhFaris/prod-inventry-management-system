import "./config/validateEnvs";
import { env } from "./config/validateEnvs";
import app from "./app";
import logger from "./utils/logger";
import { redis } from "./redis";

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis error:", err));

app.listen(env.PORT, () => {
  logger.info("Server started on port " + env.PORT);
});
