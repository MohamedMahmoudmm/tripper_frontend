import { AppBar, Toolbar, Typography, Box, Select, MenuItem } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

export default function AuthNavBar() {
    const [lang, setLang] = useState("EN");
    return (
          <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#fff",
        color: "#000",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, letterSpacing: 1, color: "#14183E" }}
        >
          Tripper
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              fontSize: 14,
              fontWeight: 500,
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
            IconComponent={ExpandMoreIcon}
          >
            <MenuItem value="EN">EN</MenuItem>
            <MenuItem value="AR">AR</MenuItem>
            <MenuItem value="FR">FR</MenuItem>
          </Select>

        </Box>
      </Toolbar>
    </AppBar>
    )
}