import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Message } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/navImage.png";
import authService from "../../services/authservice";
import { AccountCircle } from "@mui/icons-material";

const HostNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const navItems = [
    { text: "Dashboard", path: "/host/dashboard" },
    { text: "Your Listings", path: "/host/listings" },
    { text: "Bookings", path: "/host/reservations" },
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

  const { user, token } = authService.getAuthData() || {};

  const switchRole = async (role) => {
    console.log("Selected role:", role);

    try {
      if (role === "guest" && user.role.includes("host")) {
        // Switch from host → guest
        await authService.swichRole({ newRole: "host" });

        const userString = localStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          user.activeRole = "host";
          localStorage.setItem("user", JSON.stringify(user));
        }

        navigate("/host/listings");
      } else if (role === "host" && user.role.includes("guest")) {
        await authService.swichRole({ newRole: "guest" });

        const userString = localStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          user.activeRole = "guest";
          localStorage.setItem("user", JSON.stringify(user));
        }
        navigate("/home");
      } else {
        console.log("No role change needed.");
      }
    } catch (error) {
      console.error("Error switching role:", error);
    }
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
        {/*  Left - Logo */}
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

        {/*  Center - Navigation (desktop only) */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 3,
          }}
        >
          {navItems.map((item) => (
            <Button
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                textTransform: "none",
                fontWeight: location.pathname === item.path ? "bold" : 500,
                color: location.pathname === item.path ? "#f27244" : "black",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
              }}
            >
              {item.text}
            </Button>
          ))}
        </Box>

        {/*  Right - Switch + Avatar + Menu Icon */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Message sx={{ color: "#f27244", fontSize: 28 }} onClick={() => navigate("/host/chat")} cursor="pointer"/>
          {/* Switch to Guest */}
          <Button
            onClick={() => switchRole("host")}
            variant="text"
                sx={{
                  color: "#f27244",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
          >
            Switch to Guest
          </Button>

          {/* Avatar */}
        <IconButton
                color="inherit"
                onClick={() => navigate("/guest/profile")}
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
      </Toolbar>
    </AppBar>
  );
};

export default HostNavbar;
