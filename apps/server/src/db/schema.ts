import { pgTable, serial, timestamp } from "drizzle-orm/pg-core";

export const ping = pgTable("ping", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
