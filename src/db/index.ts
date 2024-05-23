import * as schema from "./schema";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { APP_CONFIG } from "../app.config";
class DatabaseClient {
  private database: NodePgDatabase<typeof schema> | undefined;
  private queryClient: Client | undefined;
  async connect() {
    if (this.database) {
      return;
    }
    this.queryClient = new Client({
      connectionString: APP_CONFIG.database_url,
    });
    await this.queryClient.connect();
    this.database = drizzle(this.queryClient, { schema });
  }

  get db() {
    return this.database!;
  }
  async end() {
    if (this.queryClient) {
      await this.queryClient.end();
    }
  }
}
export const DBClient = new DatabaseClient();
export type DBType = typeof DBClient.db;
