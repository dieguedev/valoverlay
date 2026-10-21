import { sql } from "drizzle-orm";
import request from "supertest";
import { db } from "../db/index.js";
import { app } from "../app.js";

export async function cleanAuthTables() {
  await db.execute(
    sql`TRUNCATE TABLE "session", "account", "verification", "user" CASCADE`,
  );
}

export async function createTestUser(
  email: string,
  password: string,
  name = "QA",
) {
  return request(app).post("/api/auth/sign-up/email").send({
    email,
    password,
    name,
  });
}
