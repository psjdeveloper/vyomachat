// server.js
import { WebSocketServer } from "ws";

const PORT = process.env.PORT || 3001;
const wss = new WebSocketServer({ port: PORT });

console.log(`🚀 Vyoma WebSocket server running on port ${PORT}`);

let waitingClient = null; // holds the user waiting for a partner

wss.on("connection", (ws) => {
  console.log("👤 New client connected");

  if (waitingClient) {
    // Match both clients
    ws.partner = waitingClient;
    waitingClient.partner = ws;

    ws.send("🎯 Connected with an entrepreneur!");
    waitingClient.send("🎯 Connected with an entrepreneur!");

    waitingClient = null; // clear waiting
  } else {
    // Wait for another user
    ws.send("⌛ Waiting for another entrepreneur...");
    waitingClient = ws;
  }

  // Listen for messages
  ws.on("message", (message) => {
    console.log("💬 Message received:", message.toString());

    // Send message to the paired user
    if (ws.partner && ws.partner.readyState === ws.partner.OPEN) {
      ws.partner.send(message.toString());
    }
  });

  // Handle disconnects
  ws.on("close", () => {
    console.log("❌ Client disconnected");
    if (ws.partner) ws.partner.send("⚠️ Partner disconnected.");
    if (waitingClient === ws) waitingClient = null;
  });
});
