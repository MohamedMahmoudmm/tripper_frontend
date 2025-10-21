// src/components/chat/ChatSidebar.jsx
import React from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Badge,
  TextField,
  Typography,
} from "@mui/material";

/**
 * props:
 * - conversations: [{ id, name, lastMessage, avatar, time, unreadCount, online }]
 * - onSelectConversation(id)
 * - activeId
 */
const ChatSidebar = ({ conversations = [], onSelectConversation, activeId }) => {
  return (
    <Box sx={{ width: { xs: "100%", sm: 340 }, borderRight: { xs: "none", sm: "1px solid #eee" }, height: "100%" }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight="bold">Messages</Typography>
        <TextField
          placeholder="Search messages"
          size="small"
          fullWidth
          sx={{ mt: 1 }}
        />
      </Box>

      <Box sx={{ overflowY: "auto", height: "calc(100% - 96px)", px: 1 }}>
        <List disablePadding>
          {conversations.map((c) => (
            <ListItemButton
              key={c.id}
              selected={activeId === c.id}
              onClick={() => onSelectConversation && onSelectConversation(c.id)}
              sx={{ borderRadius: 2, my: 0.5 }}
            >
              <ListItemAvatar>
                <Badge
                  variant="dot"
                  color={c.online ? "success" : "default"}
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                  <Avatar src={c.avatar} />
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>{c.name}</Typography>
                    <Typography variant="caption" sx={{ color: "gray" }}>{c.time}</Typography>
                  </Box>
                }
                secondary={
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                    <Typography variant="body2" noWrap sx={{ color: "gray" }}>{c.lastMessage}</Typography>
                    {c.unreadCount > 0 && (
                      <Box sx={{
                        bgcolor: "#FF385C",
                        color: "white",
                        px: 0.8,
                        py: 0.3,
                        borderRadius: 2,
                        fontSize: 12,
                        fontWeight: "bold"
                      }}>
                        {c.unreadCount}
                      </Box>
                    )}
                  </Box>
                }
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default ChatSidebar;
