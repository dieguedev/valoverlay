import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "./app.js";

describe("app", () => {
  it('responde 200 y { status: "ok" } en GET /health', async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
