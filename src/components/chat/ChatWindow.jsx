import React, { useRef, useEffect, useState } from "react";
import { Box, Typography, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MessageBubble from "./MessageBubble";
import NewMessageInput from "./NewMessageInput";


const ChatWindow = ({ conversation, onBack, onSendMessage }) => {
  const scrollRef = useRef(null);
  const [messages, setMessages] = useState(conversation?.messages || []);

  useEffect(() => {
    setMessages(conversation?.messages || []);
  }, [conversation]);

  useEffect(() => {
    // auto-scroll to bottom when messages change
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages, conversation]);

  const handleSend = (text, files) => {
    const newMsg = {
      id: `tmp-${Date.now()}`,
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      fromMe: true,
      status: "sent",
    };
    setMessages((m) => [...m, newMsg]);
    onSendMessage && onSendMessage(text, files, conversation?.id);
  };

  return (
    <Box sx={{ flex: 1, height: "100%", display: "flex", flexDirection: "column" }}>
      {/* header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}>
        {onBack && (
          <IconButton onClick={onBack}>
            <CloseIcon />
          </IconButton>
        )}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#034959" }}>{conversation?.name}</Typography>
          <Typography variant="caption" color="gray">Last active: {conversation?.lastSeen || "now"}</Typography>
        </Box>
      </Box>
      <Divider />

      {/* messages list */}
      <Box ref={scrollRef} sx={{ flex: 1, p: 2, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1, bgcolor: "#FAFAFB" }}>
        {messages.length === 0 && (
          <Box sx={{ textAlign: "center", mt: 6, color: "gray" }}>
            <Typography variant="body2">No messages yet. Say hi 👋</Typography>
          </Box>
        )}

        {messages.map((m, i) => {
          const prev = messages[i - 1];
          const showAvatar = !m.fromMe && (!prev || prev.fromMe);
          return <MessageBubble key={m.id} message={m} showAvatar={showAvatar} />;
        })}

        {/* typing indicator */}
        {conversation?.typing && (
          <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 1 }}>
            <Box sx={{ bgcolor: "#F1F3F5", px: 2, py: 1, borderRadius: 2 }}>
              <Typography variant="body2" sx={{ color: "gray" }}>Typing...</Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* input */}
      <Box sx={{ p: 2 }}>
        <NewMessageInput onSend={handleSend} />
      </Box>
    </Box>
  );
};

export default ChatWindow;
