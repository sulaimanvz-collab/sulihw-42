import { Server as HTTPServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { Message } from "./models/Message.js";
import { User } from "./models/User.js";

interface ExtendedWebSocket extends WebSocket {
  username?: string;
}

export const setupWebSocket = (server: HTTPServer): void => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", async (ws: ExtendedWebSocket) => {
    console.log("Новое WebSocket подключение");

    try {
      const history = await Message.find().sort({ createdAt: 1 }).limit(50);
      ws.send(JSON.stringify({ type: "HISTORY", payload: history }));
    } catch (err) {
      console.error("Ошибка при загрузке истории:", err);
    }

    ws.on("message", async (data: string) => {
      try {
        const parsed = JSON.parse(data.toString());

        if (parsed.type === "JOIN") {
          ws.username = parsed.payload.username;
          await User.findOneAndUpdate(
            { username: ws.username },
            { isOnline: true },
          );

          const onlineUsers = await User.find({ isOnline: true }).select(
            "username",
          );
          const broadcastData = JSON.stringify({
            type: "ONLINE_USERS",
            payload: onlineUsers,
          });

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(broadcastData);
            }
          });
        }

        if (parsed.type === "SEND_MESSAGE") {
          const { sender, text } = parsed.payload;
          const newMessage = new Message({ sender, text });
          await newMessage.save();

          const broadcastMsg = JSON.stringify({
            type: "NEW_MESSAGE",
            payload: newMessage,
          });

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(broadcastMsg);
            }
          });
        }
      } catch (err) {
        console.error("Ошибка обработки сообщения WS:", err);
      }
    });

    ws.on("close", async () => {
      if (ws.username) {
        await User.findOneAndUpdate(
          { username: ws.username },
          { isOnline: false },
        );

        const onlineUsers = await User.find({ isOnline: true }).select(
          "username",
        );
        const broadcastData = JSON.stringify({
          type: "ONLINE_USERS",
          payload: onlineUsers,
        });

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(broadcastData);
          }
        });
      }
      console.log("WebSocket соединение закрыто");
    });
  });
};
