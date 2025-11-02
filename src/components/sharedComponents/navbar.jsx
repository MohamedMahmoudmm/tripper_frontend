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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../../services/authservice";
import axiosInstance from "../../axiousInstance/axoiusInstance";

const Navbar = () => {
  const [lang, setLang] = useState("EN");
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { user, token } = authService.getAuthData() || {};
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
const switchRole = async (role) => {
  console.log("Selected role:", role);
  console.log("Current user role:", user.role);

  try {
    if (role === "guest" && user.role.includes("host") ) {
      // Switch from host → guest
      await authService.swichRole({ newRole: "host" });
      navigate("/host/listings");
    } else if (role === "host" && user.role.includes("guest")) {
      // Switch from guest → host
      await authService.swichRole({ newRole: "guest" });
      navigate("/home");
    } else {
      console.log("No role change needed.");
    }
  } catch (error) {
    console.error("Error switching role:", error);
  }
};

  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
  };

  // 🔹 رفع البطاقة
  const handleUpload = async () => {
    if (!selectedFile) return setMessage("Please select your ID image first");
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("identityImageUrl", selectedFile);

    try {
      const res = await axiosInstance.patch("/user/upload-id", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(res.data.message);
      setSelectedFile(null);
      setTimeout(() => setOpenDialog(false), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error uploading ID");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

            {/* ✅ Switch To Host Button */}
            {token && user?.activeRole === "guest" && !user.role.includes("host") ? (
              <Button
                variant="text"
                sx={{
                  color: "#f27244",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => setOpenDialog(true)}
              >
                Switch to Host
              </Button>
            ):(
              <Button
                variant="text"
                sx={{
                  color: "#f27244",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => switchRole(user.activeRole)}
              >
                 Switch to {user.activeRole === "host" ? "Guest" : "Host"}
              </Button>
            )}

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

        {/* 🔹 Mobile Menu */}
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
        </Menu>
      </AppBar>

      {/* 🔹 Upload ID Modal */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle fontWeight={600} textAlign="center">
          Upload Your ID Card
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", p: 3 }}>
          <Typography variant="body2" mb={2}>
            Please upload a clear image of your national ID for verification.
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          {message && (
            <Typography
              variant="body2"
              color={
                message.includes("successfully") ? "success.main" : "error.main"
              }
              mt={2}
            >
              {message}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", mb: 2 }}>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={loading}
            sx={{ bgcolor: "#f27244", textTransform: "none" }}
          >
            {loading ? <CircularProgress size={20} /> : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
