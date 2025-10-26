import { Typography, Box, Button,Stack} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function HeaderSection() {
      const navigate = useNavigate();
    
    return (
         <Box
              sx={{
                height: "64vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 6,
                mt: 12,
                background: "#fff",
              }}
            >
              <Box sx={{ maxWidth: "50%" }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "#FF5A5F", fontWeight: 600, mb: 1 }}
                >
                  BEST DESTINATIONS AROUND THE WORLD
                </Typography>
        
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 700,
                    fontSize: 70,
                    color: "#034959",
                  }}
                >
                  Travel,enjoy and live a new and full life
                </Typography>
        
                <Typography
                  variant="body1"
                  sx={{
                    color: "#5E6282",
                    mb: 4,
                    maxWidth: 420,
                  }}
                >
                  Built Wicket longer admire do barton vanity itself do in it. Preferred
                  to sportsmen it engrossed listening. Park gate sell they west hard for
                  the.
                </Typography>
        
                <Stack direction="row" spacing={3}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: "#f27244",
                      borderRadius: "25px",
                      px: 4,
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": { backgroundColor: "#034959" },
                    }}
                    onClick={() => navigate("/home")}
                  >
                    Explore Now
                  </Button>
                </Stack>
              </Box>
              <Box
                component="img"
                src="Traveller 1.png"
                alt="Travel girl"
                sx={{
                  
                  width: "40%",
                  maxHeight: "80vh",
                }}
              />
              
            </Box>
    )
}