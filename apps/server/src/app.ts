import type { HealthResponse } from "@valoverlay/shared";
import cors from "cors";
import express from "express";
import { ping } from "./db/schema.js";
import { db } from "./db/index.js";

export const app = express();

app.use(cors());

app.get("/health", (_req, res) => {
  const body: HealthResponse = { status: "ok" };
  res.json(body);
});

app.get("/db-health", async (_req, res) => {
  try {
    await db.select().from(ping).limit(1);
    res.json({ status: "ok" });
  } catch {
    res.status(500).json({ status: "error" });
  }
});
