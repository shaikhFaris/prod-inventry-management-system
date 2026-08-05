import "./config/validateEnvs";
import { env } from "./config/validateEnvs";
import app from "./app";
import logger from "./utils/logger";

app.listen(env.PORT, () => {
  logger.info("Server started on port " + env.PORT);
});
