import { useState, type FormEvent } from "react";
import { Box, Button, Paper, TextField, Typography, Grid } from "@mui/material";
import type { ChatMessage } from "../../types";

interface Props {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
}

export const ChatWindow = ({ messages, onSendMessage }: Props) => {
  const [text, setText] = useState("");

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText("");
  };

  return (
    <Paper
      variant="outlined"
      sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Typography variant="h6" gutterBottom>
        Chat room
      </Typography>

      <Box
        sx={{
          flexGrow: 1,
          height: "320px",
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: 1,
          p: 1.5,
          mb: 2,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        {messages.map((msg, index) => (
          <Typography key={msg._id || index} variant="body2">
            <strong>{msg.sender}:</strong> {msg.text}
          </Typography>
        ))}
      </Box>

      <Box component="form" onSubmit={submitHandler}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 9, sm: 10 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter message"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 3, sm: 2 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ height: "100%" }}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ChatWindow;
