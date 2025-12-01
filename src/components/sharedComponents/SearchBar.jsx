import { Box, TextField, InputAdornment, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { IconButton } from "@mui/material";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  onClear,
}) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
      <Paper
        elevation={3}
        sx={{
          p: 0.5,
          borderRadius: "40px",
          display: "flex",
          alignItems: "center",
          width: "100%",
          maxWidth: 500,
          background: "#ffffff",
          transition: "box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{ color: "#f27244", opacity: 0.8, fontSize: 26 }}
                />
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
                  sx={{ color: "#666" }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: "40px",
              "& fieldset": { border: "none" },
            },
          }}
          sx={{
            "& .MuiInputBase-input": {
              padding: "12px 14px",
              fontSize: "0.95rem",
              fontWeight: 500,
            },
            "& .MuiOutlinedInput-root": {
              "&:hover": {
                backgroundColor: "#fef5f2",
              },
              "&.Mui-focused": {
                backgroundColor: "#fef5f2",
                boxShadow: "0 0 0 3px rgba(242, 114, 68, 0.1)",
              },
            },
          }}
        />
      </Paper>
    </Box>
  );
}