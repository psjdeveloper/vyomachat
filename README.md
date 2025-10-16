# VyomaChat

Lightweight peer-to-peer pairing WebSocket server for quick entrepreneur-to-entrepreneur conversations.

This repository contains a small Node.js WebSocket server that pairs two connected clients together and relays text messages between them. It's intentionally minimal and uses the `ws` library.

## Features

- Matches two connected clients into a one-to-one session.
- Relays plain text messages between paired clients.
- Simple reconnect/close handling and a single waiting queue.

## Requirements

- Node.js 14+ (or any version that supports ES modules). 
- npm (or yarn) to install dependencies.

## Quick start

1. Install dependencies:

```powershell
npm install
```

2. Start the server (default port 3001):

```powershell
npm start
```

3. Optionally, set a custom port with an environment variable:

```powershell
$env:PORT=8080; npm start
```

You should see a console message like:

```
🚀 Vyoma WebSocket server running on port 3001
```

## How it works

When a client connects:

- If there is already a waiting client, the server pairs the two and notifies both with a welcome message.
- If there is no waiting client, the connecting client is placed into a single-slot waiting queue and informed to wait.
- Messages from a client are forwarded to its paired partner, if connected.
- When a client disconnects, their partner (if any) receives a notification.

The core server file is `server.js` and uses the `ws` package to create a WebSocket server.

## Client example (JavaScript)

Here's a minimal browser or Node client example that connects to the server and sends/receives text messages:

```javascript
// Browser or Node (with a WebSocket implementation)
const url = 'ws://localhost:3001';
const ws = new WebSocket(url);

ws.addEventListener('open', () => {
  console.log('connected');
  // Send a test message once connected or after pairing
  ws.send('Hello from client!');
});

ws.addEventListener('message', (evt) => {
  console.log('received:', evt.data);
});

ws.addEventListener('close', () => console.log('disconnected'));
ws.addEventListener('error', (e) => console.error('ws error', e));
```

For Node.js clients, use the `ws` package similarly:

```javascript
import WebSocket from 'ws';
const ws = new WebSocket('ws://localhost:3001');
// same event handlers as above
```

## Environment

- PORT (optional): Port number to run the WebSocket server on. Defaults to `3001`.

## Limitations & notes

- Single waiting slot: only one unmatched client can wait at a time. If many users connect, later clients will replace the waiting client behavior until matched.
- No authentication, encryption (wss), or persistent history. For production use, add TLS, authentication, reconnect logic, and better matchmaking.
- Messages are relayed as plain text; if you need structured data, use JSON strings and implement message types.

## Suggested improvements (small and safe)

- Use a queue to support multiple waiting clients instead of a single `waitingClient` slot.
- Add JSON message envelopes { type, payload } to support signaling (join/leave/typing).
- Add health checks and graceful shutdown handling (SIGINT/SIGTERM) to close connections cleanly.

## License

This project doesn't include a license file. Add one (for example, MIT) if you intend to open-source it.

---

If you'd like, I can also:

- Add a basic HTML client page to demo pairing locally.
- Improve the server to support a waiting queue and simple message envelopes.

Tell me which of those you'd like and I'll implement it.
