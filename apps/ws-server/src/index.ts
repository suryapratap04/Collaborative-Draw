import express from "express";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || "123123";
const prismaClient = new PrismaClient();

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

// Validate JWT and return userId
function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded !== "object" || !decoded || !("userId" in decoded)) {
      return null;
    }
    return (decoded as any).userId;
  } catch {
    return null;
  }
}

wss.on("connection", (ws, request) => {
  const url = request.url;
  if (!url) {
    ws.close();
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const userId = checkUser(token);
  console.log("User ID:", userId);

  if (!userId) {
    ws.close();
    return;
  }

  const user: User = { ws, rooms: [], userId };
  users.push(user);

  ws.on("message", async (data) => {
    let parsedData: any;

    try {
      parsedData =
        typeof data === "string"
          ? JSON.parse(data)
          : JSON.parse(data.toString());
    } catch (err) {
      console.error("Invalid JSON received:", data);
      return;
    }

    if (!parsedData?.type) return;

    switch (parsedData.type) {
      case "join_room": {
        if (!parsedData.roomId) return;
        if (!user.rooms.includes(parsedData.roomId)) {
          user.rooms.push(parsedData.roomId);
        }
        break;
      }

      case "leave_room": {
        if (!parsedData.roomId) return;
        user.rooms = user.rooms.filter((room) => room !== parsedData.roomId);
        break;
      }

      case "chat": {
        const { roomId, message } = parsedData;
        if (!roomId || !message) return;

        try {
          await prismaClient.chat.create({
            data: {
              roomId: Number(roomId),
              message,
              userId,
            },
          });

          users.forEach((u) => {
            if (u.rooms.includes(roomId)) {
              u.ws.send(
                JSON.stringify({
                  type: "chat",
                  message,
                  roomId,
                })
              );
            }
          });
        } catch (err) {
          console.error("Error saving message to DB:", err);
        }

        break;
      }

      default:
        console.warn("Unknown message type:", parsedData.type);
    }
  });

  ws.on("close", () => {
    const index = users.findIndex((u) => u.ws === ws);
    if (index !== -1) users.splice(index, 1);
  });
});

setInterval(() => {
  users.forEach((user) => {
    if (user.ws.readyState === WebSocket.OPEN) {
      user.ws.ping();
    }
  });
}, 30000);

server.listen(PORT, () => {
  console.log(`WebSocket server listening on port ${PORT}`);
});
