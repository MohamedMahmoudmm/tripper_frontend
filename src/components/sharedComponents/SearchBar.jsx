import { Box, TextField, InputAdornment, IconButton, Popover, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useState } from "react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  onClear,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    if (!value) {
      setAnchorEl(null);
    }
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        onClick={handleClick}
        size="small"
        startIcon={<SearchIcon sx={{ fontSize: 18 }} />}
        sx={{
          color: "#666",
          textTransform: "none",
          fontSize: "0.875rem",
          fontWeight: 500,
          px: 1.5,
          py: 0.75,
          minWidth: "auto",
          "&:hover": {
            bgcolor: "#f5f5f5",
          },
        }}
      >
        Search
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            width: 320,
            p: 2,
          },
        }}
      >
        <TextField
          autoFocus
          fullWidth
          size="small"
          variant="outlined"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#f27244", fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: value && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => {
                    onChange({ target: { value: "" } });
                    if (onClear) onClear();
                  }}
                  sx={{ padding: "4px" }}
                >
                  <ClearIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#e0e0e0",
              },
              "&:hover fieldset": {
                borderColor: "#f27244",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#f27244",
              },
            },
          }}
        />
      </Popover>
    </>
  );
}