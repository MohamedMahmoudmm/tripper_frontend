import {
    AppBar,
    Toolbar,
    Box,
    Button,
    useMediaQuery,
    Select,
    MenuItem,

} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const DefaultNavBar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [lang, setLang] = useState("EN");
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
                                <AccountCircleIcon fontSize="medium" />
                            </Box>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
        </>
    );
};

export default DefaultNavBar;
