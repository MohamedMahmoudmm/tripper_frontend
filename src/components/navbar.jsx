import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Button,
  Tabs,
  Tab,
  Paper,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import LanguageIcon from "@mui/icons-material/Language";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import SearchBarFields from "./SearchBarFields";

const Navbar = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setOpenDrawer(!openDrawer);
  };

  return (
    <>
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{
          borderBottom: "1px solid #ddd",
          px: { xs: 2, sm: 4, md: 6 },
          py: 1,
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
          {/* Left Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg"
              alt="Airbnb logo"
              style={{
                height: 36,
                width: "auto",
                cursor: "pointer",
              }}
            />
          </Box>

          {/* Center Tabs or Menu Icon */}
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
            <Box>
              <Tabs
                value={tabValue}
                onChange={(e, val) => setTabValue(val)}
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontSize: 14,
                    minWidth: 80,
                    color: "#555",
                    "&.Mui-selected": { color: "black" },
                  },
                  "& .MuiTabs-flexContainer": {
                    alignItems: "flex-end",
                    gap: "20px",
                  },
                }}
              >
                <Tab
                  icon={<HomeIcon sx={{ fontSize: 24 }} />}
                  iconPosition="top"
                  label="Homes"
                />
                <Tab
                  icon={<EmojiEventsIcon sx={{ fontSize: 24 }} />}
                  iconPosition="top"
                  label="Experiences"
                />
                <Tab
                  icon={<RoomServiceIcon sx={{ fontSize: 24 }} />}
                  iconPosition="top"
                  label="Services"
                />
              </Tabs>
            </Box>
          )}

          {/* Right side */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                sx={{ textTransform: "none", fontSize: 14, color: "black" }}
              >
                Become a host
              </Button>
              <IconButton>
                <LanguageIcon />
              </IconButton>
              <Box
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
                <MenuIcon fontSize="small" />
                <AccountCircleIcon fontSize="medium" />
              </Box>
            </Box>
          )}
        </Toolbar>

        {/* Search Bar */}
        <Paper
          elevation={3}
          sx={{
            width: { xs: "95%", sm: "85%", md: "70%" },
            maxWidth: "900px",
            mx: "auto",
            mt: { xs: 2, md: 3 },
            mb: { xs: 2, md: 4 },
            borderRadius: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            transition: "all 0.3s ease",
          }}
        >
          <SearchBarFields />
        </Paper>
      </AppBar>

      {/* Drawer for mobile */}
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: { width: 250, paddingTop: 2 },
        }}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Homes" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Experiences" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Services" />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider sx={{ my: 1 }} />

        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Become a host" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Language" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
