import { createServer } from "node:http";
import { Server } from "socket.io";
import { app } from "./app.js";

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

httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
