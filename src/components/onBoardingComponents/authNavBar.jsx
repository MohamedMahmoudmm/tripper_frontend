import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Select,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";

const HostNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
    const [lang, setLang] = useState("EN");

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const navItems = [
    { text: "Hotels", path: "/home" },
    { text: "Experiences", path: "/experiences" },
    { text: "Favourite", path: "/favourites" },
  ];

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleProfile = () => {
    handleMenuClose();
    navigate("/host/profile");
  };

  const handleLogout = () => {
    handleMenuClose();
    console.log("Logout clicked");
  };

  const handleSwitch = () => {
    handleMenuClose();
    navigate("/home");
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "white",
        color: "black",
        borderBottom: "1px solid #eee",
        boxShadow: "0px 1px 4px rgba(0,0,0,0.05)",
        transition: "none",
        zIndex: 1201,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, sm: 4, md: 6 },
          height: "64px",
          minHeight: "64px",
          position: "relative",
        }}
      >
        {/* ✅ Left - Logo */}
        <Box
          component="img"
          src="navImage.png"
          alt="Tripper logo with slogan"
          sx={{
            height: 40,
            width: 200,
            objectFit: "cover",
            mb: 1,
          }}
        />

        {/*  Center - Navigation (desktop only) */}
      

        {/*  Right - Switch + Avatar + Menu Icon */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Switch to Guest */}
          <Button
            variant="text"
            onClick={handleSwitch}
            sx={{
              textTransform: "none",
              color: "black",
              fontSize: 14,
              fontWeight: 500,
              "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
            }}
          >
            Switch to Guest
          </Button>

          {/* Avatar */}
          <Avatar
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80"
            alt="profile"
            sx={{
              width: 36,
              height: 36,
              cursor: "pointer",
              border: "1px solid #ddd",
              "&:hover": { transform: "scale(1.05)" },
              transition: "0.3s",
            }}
            onClick={handleProfile}
          />

          {/* Menu Icon */}
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              border: "1px solid #ddd",
              borderRadius: "50%",
              "&:hover": { backgroundColor: "#f7f7f7" },
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            disableScrollLock
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                mt: 1.2,
                borderRadius: 2,
                boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
                minWidth: 170,
              },
            }}
          >
            <MenuItem onClick={handleProfile}>Profile</MenuItem>
            <Divider />
            <MenuItem >   
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
              </Select></MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HostNavbar;
