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
  ListItem,
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
import { FavoriteBorder } from "@mui/icons-material";

const Navbar = ({ tabValue, setTabValue }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [lang, setLang] = useState("EN");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));


  const handleDrawerToggle = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleTabChange = (e, newVal) => {
    setTabValue(newVal);
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
          {/* Logo */}
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
                "& .MuiTabs-flexContainer": {
                  alignItems: "flex-end",
                  gap: "20px",
                },
              }}
            >
              <Tab icon={<HomeIcon />} iconPosition="top" label="Homes" />
              <Tab
                icon={<EmojiEventsIcon />}
                iconPosition="top"
                label="Experiences"
              />
              <Tab
                icon={<FavoriteBorder />}
                iconPosition="top"
                label="Favourites"
              />
            </Tabs>
          )}

          {/* Right section */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                sx={{ textTransform: "none", fontSize: 14, color: "black" }}
              >
                Become a host
              </Button>
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

       
      </AppBar>

      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: { width: 250, paddingTop: 2 },
        }}
      >
        <List>
          {["Homes", "Experiences", "Services", "Favourites"].map((text, index) => (
            <ListItem disablePadding key={text}>
              <ListItemButton
                onClick={() => {
                  setTabValue(index);
                  handleDrawerToggle();
                }}
              >
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
    </>
  );
};

export default Navbar;
