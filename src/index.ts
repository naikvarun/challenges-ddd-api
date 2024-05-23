import "dotenv/config";
import { DBClient } from "./db";
import { appFactory } from "./app";
import { APP_CONFIG } from "./app.config";
import { getLogger } from "./app.logger";
const logger = getLogger("index");
async function main() {
  await DBClient.connect();
  appFactory(DBClient.db).listen(APP_CONFIG.port, () => {
    logger.info(`server listening on port ${APP_CONFIG.port}`);
  });
}

main()
  .then()
  .catch((err) => console.error(err));
