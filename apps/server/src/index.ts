import { createServer } from "node:http";
import type { HealthResponse } from "@valoverlay/shared";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import { ping } from "./db/schema.js";
import { db } from "./db/index.js";

const app = express();
const port = process.env.PORT ?? 3000;
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

const DEV_TOKEN = "dev-token";

io.on("connection", (socket) => {
  socket.on("join", (token: string) => {
    socket.join(token);
  });
});

setInterval(() => {
  io.to(DEV_TOKEN).emit("tick", { timestamp: Date.now() });
}, 2000);

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

httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
