import React, { useState, useRef } from "react";
import {  IconButton, InputBase, Paper } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";


const NewMessageInput = ({ onSend, placeholder = "Write a message..." }) => {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed && files.length === 0) return;
    onSend && onSend(trimmed, files);
    setText("");
    setFiles([]);
    inputRef.current && inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFiles = (e) => {
    const chosen = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...chosen].slice(0, 5)); // limit to 5 for UX
    e.target.value = null;
  };

  return (
    <Paper
      elevation={1}
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSend();
      }}
      sx={{
        display: "flex",
        gap: 1,
        alignItems: "center",
        p: 1,
        borderRadius: 3,
      }}
    >
      <IconButton component="label" size="small">
        <AttachFileIcon />
        <input hidden type="file" multiple onChange={handleFiles} />
      </IconButton>

      <IconButton size="small" sx={{ ml: 0.5 }}>
        <InsertEmoticonIcon />
      </IconButton>

      <InputBase
        inputRef={inputRef}
        multiline
        minRows={1}
        maxRows={4}
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{ flex: 1, px: 1 }}
      />

      <IconButton
        color="primary"
        onClick={handleSend}
        sx={{
          bgcolor: "#FF385C",
          color: "white",
          "&:hover": { bgcolor: "#E31C5F" },
        }}
      >
        <SendIcon />
      </IconButton>
    </Paper>
  );
};

export default NewMessageInput;
