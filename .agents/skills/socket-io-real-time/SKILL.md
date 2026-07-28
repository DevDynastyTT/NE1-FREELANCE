---
name: socket-io-real-time
description: Socket.IO custom server, client connection, event handling, online user tracking, typing indicators.
---

# Socket.IO Real-Time Messaging

## Custom Server (`server.mjs`)

The project uses a custom Next.js server with Socket.IO on the same port:

```js
import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer, { cors: { origin, credentials: true } });
  // ...
  httpServer.listen(port);
});
```

## Client Connection

```tsx
import io from 'socket.io-client';
const socket = io(); // Connects to current origin automatically
```

## Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `online-users` | Client → Server | `{ userID }` |
| `send-message` | Client → Server | `{ message, file?, sender, receiver, senderID, receiverID }` |
| `typing-alert` | Client → Server | `{ senderID, receiverID }` |
| `receive-message` | Server → Client | `{ senderID, newMessage, sender, file? }` |
| `receive-typing-alert` | Server → Client | `{ senderID, receiverID, isTyping }` |

## Server Tracking

```js
const onlineUsers = new Map();   // userID → socketID
const typingStatus = new Map();  // senderID → boolean (auto-clears after 5s)
```

## Message Flow

1. Client emits `send-message`
2. Server looks up receiver's socket via `onlineUsers`
3. Server emits `receive-message` to receiver's socket
4. Message also saved to MongoDB via API (`/api/auth/messages/send`)
