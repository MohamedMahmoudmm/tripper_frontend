import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Button,
  Select,
  MenuItem,
  Menu,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [lang, setLang] = useState("EN");
  const [anchorEl, setAnchorEl] = useState(null);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const navLinks = [
    { label: "Homes", path: "/home" },
    { label: "Experiences", path: "/experiences" },
    { label: "Favourites", path: "/favourites" },
    { label: "Places", path: "/places" },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "#fff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        px: { xs: 2, md: 4 },
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
        <Box
          component="img"
          src="/navImage.png"
          alt="Tripper Logo"
          sx={{ height: 40, cursor: "pointer" }}
          onClick={() => navigate("/home")}
        />

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 3,
          }}
        >
          {navLinks.map((link) => (
            <Button
              key={link.label}
              onClick={() => handleNavigate(link.path)}
              sx={{
                color: location.pathname === link.path ? "#f27244" : "#333",
                textTransform: "none",
                fontWeight: location.pathname === link.path ? "bold" : "500",
                "&:hover": { color: "#f27244" },
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            size="small"
            variant="outlined"
            IconComponent={ExpandMoreIcon}
            sx={{
              minWidth: 70,
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
          >
            <MenuItem value="EN">EN</MenuItem>
            <MenuItem value="AR">AR</MenuItem>
            <MenuItem value="FR">FR</MenuItem>
          </Select>

          {token ? (
            <IconButton
              color="inherit"
              onClick={() => navigate("/host/dashboard")}
            >
              <AccountCircle sx={{ color: "#333" }} />
            </IconButton>
          ) : (
            <Button
              variant="contained"
              sx={{
                bgcolor: "#f27244",
                textTransform: "none",
                borderRadius: "20px",
                px: 3,
                "&:hover": { bgcolor: "#034959" },
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}

          <IconButton
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiPaper-root": { width: 200, mt: 1 },
        }}
      >
        {navLinks.map((link) => (
          <MenuItem
            key={link.label}
            onClick={() => handleNavigate(link.path)}
            sx={{
              color: location.pathname === link.path ? "#f27244" : "#333",
              fontWeight: location.pathname === link.path ? "bold" : "500",
            }}
          >
            {link.label}
          </MenuItem>
        ))}
        <MenuItem
          onClick={() =>
            token ? navigate("/host/dashboard") : navigate("/login")
          }
        >
          {token ? "Host Dashboard" : "Login"}
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar;
