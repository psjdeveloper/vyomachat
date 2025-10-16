import express from "express";
import { WebSocketServer } from "ws";
import http from "http";

const app = express();
const server = http.createServer(app);

// 👇 Add a path to ensure Render handles upgrade correctly
const wss = new WebSocketServer({ server, path: "/" });

const PORT = process.env.PORT || 10000;

let waitingClient = null;

app.get("/", (req, res) => {
  res.send("VyomaChat WebSocket Server is live ✅");
});

wss.on("connection", (ws) => {
  console.log("👤 New client connected");

  if (waitingClient) {
    ws.partner = waitingClient;
    waitingClient.partner = ws;
    ws.send("🎯 Connected with an entrepreneur!");
    waitingClient.send("🎯 Connected with an entrepreneur!");
    waitingClient = null;
  } else {
    ws.send("⌛ Waiting for another entrepreneur...");
    waitingClient = ws;
  }

  ws.on("message", (message) => {
    console.log("💬", message.toString());
    if (ws.partner && ws.partner.readyState === ws.partner.OPEN) {
      ws.partner.send(message.toString());
    }
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
    if (ws.partner) ws.partner.send("⚠️ Partner disconnected.");
    if (waitingClient === ws) waitingClient = null;
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
