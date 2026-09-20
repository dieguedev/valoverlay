import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { eq } from "drizzle-orm";
import { app } from "./app.js";
import { db } from "./db/index.js";
import { user } from "./db/auth-schema.js";
import { cleanAuthTables } from "./test/db.js";

describe("POST /api/auth/sign-up/email", () => {
  beforeEach(async () => {
    await cleanAuthTables();
  });

  it("crea un usuario real en la base de datos", async () => {
    const res = await request(app).post("/api/auth/sign-up/email").send({
      email: "qa+signup@valoverlay.test",
      password: "Contraseña123!",
      name: "QA",
    });

    expect([200, 201]).toContain(res.status);

    const rows = await db
      .select()
      .from(user)
      .where(eq(user.email, "qa+signup@valoverlay.test"));

    expect(rows).toHaveLength(1);
  });

  it("la respuesta incluye una cookie de sesión", async () => {
    const res = await request(app).post("/api/auth/sign-up/email").send({
      email: "qa+cookie@valoverlay.test",
      password: "Contraseña123!",
      name: "QA",
    });

    expect(res.headers["set-cookie"]).not.toBeUndefined();
  });

  it("rechaza un email duplicado", async () => {
    const payload = {
      email: "qa+duplicate@valoverlay.test",
      password: "Contraseña123!",
      name: "QA",
    };

    await request(app).post("/api/auth/sign-up/email").send(payload);
    const res = await request(app)
      .post("/api/auth/sign-up/email")
      .send(payload);

    expect(res.status).toBeGreaterThanOrEqual(400);

    const rows = await db
      .select()
      .from(user)
      .where(eq(user.email, payload.email));

    expect(rows).toHaveLength(1);
  });
});
