// src/components/chat/MessageBubble.jsx
import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

/**
 * props:
 * - message: { id, text, time, fromMe (bool), avatarUrl?, status: 'sent'|'delivered'|'read' }
 * - showAvatar (bool) => whether to show avatar on left (for incoming messages)
 */
const MessageBubble = ({ message, showAvatar = true }) => {
  const { text, time, fromMe, avatarUrl, status } = message;

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        alignItems: "flex-end",
        justifyContent: fromMe ? "flex-end" : "flex-start",
        width: "100%",
      }}
    >
      {!fromMe && showAvatar && (
        <Avatar src={avatarUrl} sx={{ width: 36, height: 36 }} />
      )}

      <Box
        sx={{
          maxWidth: "78%",
          display: "inline-block",
          bgcolor: fromMe ? "#FF385C" : "#F1F3F5",
          color: fromMe ? "white" : "black",
          px: 2,
          py: 1,
          borderRadius: 2,
          borderTopRightRadius: fromMe ? 8 : 16,
          borderTopLeftRadius: fromMe ? 16 : 8,
          boxShadow: fromMe ? "0 6px 18px rgba(255,56,92,0.12)" : "none",
          wordBreak: "break-word",
        }}
      >
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.4 }}>
          {text}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 0.5,
            textAlign: "right",
            opacity: 0.8,
            fontSize: 11,
          }}
        >
          {time} {fromMe && status ? `• ${status === "read" ? "✓✓" : status === "delivered" ? "✓" : ""}` : ""}
        </Typography>
      </Box>

      {fromMe && showAvatar && (
        <Avatar src={avatarUrl} sx={{ width: 36, height: 36, opacity: 0 }} />
        /*
          For alignment we optionally render an invisible avatar on the right so layout consistent.
          In production you might want to render the user's avatar if needed.
        */
      )}
    </Box>
  );
};

export default MessageBubble;
