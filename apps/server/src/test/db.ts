import { sql } from "drizzle-orm";
import { db } from "../db/index.js";

export async function cleanAuthTables() {
  await db.execute(
    sql`TRUNCATE TABLE "session", "account", "verification", "user" CASCADE`,
  );
}
