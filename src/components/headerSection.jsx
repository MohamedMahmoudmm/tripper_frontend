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
                background: "linear-gradient(90deg, #fff 60%, #f8f9ff 40%)",
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
                    color: "#14183E",
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
                      backgroundColor: "#FF5A5F",
                      borderRadius: "25px",
                      px: 4,
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": { backgroundColor: "#ff7b7f" },
                    }}
                    onClick={() => navigate("/login")}
                  >
                    Get Started
                  </Button>
                </Stack>
              </Box>
              <Box
                component="img"
                src="https://img.freepik.com/free-photo/full-length-traveling-woman-holding-passport-tickets_23-2148688704.jpg"
                alt="Travel girl"
                sx={{
                  width: "40%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
              />
              
            </Box>
    )
}