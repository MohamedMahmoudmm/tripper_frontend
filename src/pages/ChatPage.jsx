import React, { useState } from "react";
import { Box, Drawer, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";

const DUMMY = [
  {
    id: "c1",
    name: "Sara",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    lastMessage: "See you tomorrow!",
    time: "09:24",
    unreadCount: 1,
    online: true,
    lastSeen: "online",
    typing: false,
    messages: [
      { id: "m1", text: "Hi ", time: "09:20", fromMe: false, avatar: "https://randomuser.me/api/portraits/women/44.jpg", status: "delivered" },
      { id: "m2", text: "Hey Sara, how are you?", time: "09:21", fromMe: true, status: "delivered" },
      { id: "m3", text: "ALi good! Ready for tomorrow.", time: "09:22", fromMe: false, status: "delivered" },
    ],
  },
  {
    id: "c2",
    name: "Ali",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    lastMessage: "Thanks!",
    time: "Yesterday",
    unreadCount: 0,
    online: false,
    lastSeen: "yesterday",
    typing: false,
    messages: [
      { id: "m1", text: "Thanks for the info", time: "Mon", fromMe: false, status: "delivered" },
    ],
  },
];

const ChatPage = () => {
  const [conversations] = useState(DUMMY);
  const [activeId, setActiveId] = useState(conversations[0].id);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const activeConv = conversations.find((c) => c.id === activeId);

  const handleSelect = (id) => {
    setActiveId(id);
    if (isMobile) setDrawerOpen(false); // close sidebar on mobile when selecting conversation
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "white" }}>
      {/* Sidebar for desktop */}
      {!isMobile ? (
        <ChatSidebar conversations={conversations} onSelectConversation={handleSelect} activeId={activeId} />
      ) : (
        <>
          <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} anchor="left">
            <Box sx={{ width: 300 }}>
              <ChatSidebar conversations={conversations} onSelectConversation={(id) => { handleSelect(id); setDrawerOpen(false); }} activeId={activeId} />
            </Box>
          </Drawer>
        </>
      )}

      {/* Chat window */}
      <Box sx={{ flex: 1 }}>
        <ChatWindow
          conversation={activeConv}
          onBack={isMobile ? () => setDrawerOpen(true) : undefined}
          onSendMessage={(text, files, convId) => {
            console.log("send", { text, files, convId });
            // integrate with your API / websocket here
          }}
        />
      </Box>
    </Box>
  );
};

export default ChatPage;
