import { Box, TextField } from "@mui/material";

export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
      <TextField
        variant="outlined"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        InputProps={{
          startAdornment: (
            <i
              className="bi bi-search"
              style={{ marginRight: 8, opacity: 0.7 }}
            ></i>
          ),
          sx: {
            borderRadius: "50px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            "& fieldset": {
              borderRadius: "50px",
            },
          },
        }}
        sx={{
          width: "100%",
          maxWidth: 350,
        }}
      />
    </Box>
  );
}
