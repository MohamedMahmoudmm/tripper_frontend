import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Button,
  Tabs,
  Tab,
  useMediaQuery,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Select,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FavoriteBorder, LocationOn } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Navbar = ({ tabValue, setTabValue }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [lang, setLang] = useState("EN");
  const token = localStorage.getItem("token");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleTabChange = (e, newVal) => {
    setTabValue(newVal);
  };

  const handleSwitchToHost = () => {
    navigate("/host/dashboard");
  };

  const tabs = [
    { label: "Homes", icon: <HomeIcon /> },
    { label: "Experiences", icon: <EmojiEventsIcon /> },
    { label: "Favourites", icon: <FavoriteBorder /> },
    { label: "Discover", icon: <LocationOn /> },
  ];

  return (
    <>
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{
          borderBottom: "1px solid #ddd",
          px: { xs: 2, sm: 3, md: 5 },
          backgroundColor: "white",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Logo */}
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

          {/* Tabs or Menu */}
          {isMobile ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={handleDrawerToggle}>
                <MenuIcon sx={{ color: "black" }} />
              </IconButton>
              <IconButton>
                <AccountCircleIcon sx={{ color: "black" }} />
              </IconButton>
            </Box>
          ) : (
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontSize: 14,
                  minWidth: 80,
                  color: "#555",
                  "&.Mui-selected": { color: "black" },
                },
                "& .MuiTabs-flexContainer": { alignItems: "flex-end"},
              }}
            >
              {tabs.map((tab, index) => (
                <Tab key={tab.label} icon={tab.icon} iconPosition="top" label={tab.label} />
              ))}
            </Tabs>
          )}

          {/* Right section */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {token ? <Button
                sx={{ textTransform: "none", fontSize: 14, color: "black" }}
                onClick={handleSwitchToHost}
              >
                Switch to Host
              </Button> : <Button
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
              </Button>}

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

             { token && <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ddd",
                  borderRadius: "30px",
                  padding: "5px 10px",
                  gap: 1,
                  cursor: "pointer",
                  "&:hover": { boxShadow: "0 0 5px rgba(0,0,0,0.1)" },
                }}
              >
                <AccountCircleIcon fontSize="medium" />
              </Box>}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile */}
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={handleDrawerToggle}
        PaperProps={{ sx: { width: 250, paddingTop: 2 } }}
      >
        <List>
          {tabs.map((tab, index) => (
            <ListItemButton
              key={tab.label}
              onClick={() => {
                setTabValue(index);
                handleDrawerToggle();
              }}
            >
              <ListItemText primary={tab.label} />
            </ListItemButton>
          ))}
          <Divider />
          {
            token?<ListItemButton onClick={handleSwitchToHost}>
            <ListItemText primary="Switch to Host" />
          </ListItemButton>: <ListItemButton onClick={() => navigate("/login")}>
            <ListItemText primary="Login" />
          </ListItemButton>
          }
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
