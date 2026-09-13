import { useEffect, useRef, useState } from "react";
import { Container, Grid } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { useAppSelector } from "./app/hooks";
import { selectUser } from "./features/users/usersSlice";
import AppToolbar from "./components/AppToolbar";
import Register from "./features/users/Register";
import Login from "./features/users/Login";
import OnlineList from "./features/chat/OnlineList";
import ChatWindow from "./features/chat/ChatWindow";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";
import type { ChatMessage, IncomingMessage, OnlineUser } from "./types";

export const App = () => {
  const user = useAppSelector(selectUser);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!user) {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
      return;
    }

    const websocket = new WebSocket("ws://localhost:8000");
    ws.current = websocket;

    websocket.onopen = () => {
      if (user.username) {
        websocket.send(
          JSON.stringify({
            type: "JOIN",
            payload: { username: user.username },
          }),
        );
      }
    };

    websocket.onmessage = (event) => {
      try {
        const decodedMessage: IncomingMessage = JSON.parse(event.data);

        if (decodedMessage.type === "ONLINE_USERS") {
          setOnlineUsers(decodedMessage.payload);
        }

        if (decodedMessage.type === "HISTORY") {
          setMessages(decodedMessage.payload);
        }

        if (decodedMessage.type === "NEW_MESSAGE") {
          setMessages((prev) => {
            const isDuplicate = prev.some(
              (m) => m._id === decodedMessage.payload._id,
            );
            if (isDuplicate) return prev;
            return [...prev, decodedMessage.payload];
          });
        }
      } catch (e) {
        console.error("WebSocket parse error:", e);
      }
    };

    websocket.onclose = () => {
      console.warn("WebSocket connection closed.");
    };

    websocket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      websocket.onclose = null;
      websocket.close();
    };
  }, [user]);

  const handleSendMessage = (text: string) => {
    if (
      ws.current &&
      ws.current.readyState === WebSocket.OPEN &&
      user?.username
    ) {
      ws.current.send(
        JSON.stringify({
          type: "SEND_MESSAGE",
          payload: {
            sender: user.username,
            text,
          },
        }),
      );
    }
  };

  return (
    <>
      <AppToolbar />
      <Container maxWidth="xl">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                    <OnlineList users={onlineUsers} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 8, lg: 9 }}>
                    <ChatWindow
                      messages={messages}
                      onSendMessage={handleSendMessage}
                    />
                  </Grid>
                </Grid>
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;
