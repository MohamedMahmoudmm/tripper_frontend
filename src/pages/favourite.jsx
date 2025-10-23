import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Button, Container } from "@mui/material";
import HomeCard from "../components/HomeCard";
import { useNavigate } from "react-router-dom";
import FooterComponent from "../components/onBoardingComponents/footer";

export default function FavouritePage() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(stored);
  }, []);

  return (
    <Box sx={{ backgroundColor: "#fafafa", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {favorites.length === 0 ? (
          <Box sx={{ mt: 6, textAlign: "center" }}>
            <Typography color="gray" sx={{ mb: 1 }}>
              No favourites yet
            </Typography>
            <Typography color="gray" sx={{ mb: 3 }}>
              As you search, click the heart icon to save your favorite places and experiences to a wishlist.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#14183E",
                borderRadius: "16px",
                px: 4,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#14186E" },
              }}
              onClick={() => navigate("/home")}
            >
              Start Exploring
            </Button>
          </Box>
        ) : (
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="stretch"
          >
            {favorites.map((item, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box sx={{ width: "100%", maxWidth: 320 }}>
                  <HomeCard {...item} />
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <FooterComponent />
    </Box>
  );
}
