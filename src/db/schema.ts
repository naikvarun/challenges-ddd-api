import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const challenges = pgTable("challenges", {
  id: varchar("id", { length: 8 }).primaryKey(),
  name: text("name").notNull().unique(),
  content: text("content").notNull(),
  level: integer("level").notNull().default(1),
});
