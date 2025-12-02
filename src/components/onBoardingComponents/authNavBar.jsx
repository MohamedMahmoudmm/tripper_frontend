import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/navImage.png";
import { Message } from "@mui/icons-material";
import { AccountCircle } from "@mui/icons-material";
import authService from "../../services/authservice";
const HostNavbar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const [anchorEl, setAnchorEl] = useState(null);
  console.log("Token in HostNavbar:", anchorEl);

  const handleMenuClose = () => setAnchorEl(null);

  const handleProfile = () => {
    handleMenuClose();
    navigate("/guest/profile");
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
        <Box
          component="img"
          src={logo}
          alt="Tripper logo with slogan"
          sx={{
            height: 40,
            width: 200,
            objectFit: "cover",
            mb: 1,
          }}
        />
        {
          token == null ?
            <Button
              variant="contained"
              size="medium"
              sx={{
                backgroundColor: "#f27244",
                borderRadius: "15px",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#034959" },
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            : <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Message sx={{ color: "#f27244", fontSize: 28 }} onClick={() => navigate("/chat")} cursor="pointer" />
              <IconButton
                color="inherit"
                onClick={handleProfile}
              >
                <AccountCircle sx={{ color: "#333" }} />
              </IconButton>
              <Button
                variant="text"
                sx={{
                  color: "#f27244",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => {
                  authService.logout();
                  navigate("/login");
                }}
              >
                Logout
              </Button>
            </Box>
        }
      </Toolbar>
    </AppBar>
  );
};

export default HostNavbar;
