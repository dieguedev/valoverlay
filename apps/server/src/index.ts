import type { HealthResponse } from "@valoverlay/shared";
import cors from "cors";
import express from "express";

const app = express();
const port = process.env.PORT ?? 3000;

app.use(cors());

app.get("/health", (_req, res) => {
  const body: HealthResponse = { status: "ok" };
  res.json(body);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
