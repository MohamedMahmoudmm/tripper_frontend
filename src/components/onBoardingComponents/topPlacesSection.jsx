import { Typography, Box, Grid, Card, CardMedia, CardContent, Button, Snackbar, Alert } from "@mui/material";
import React, { useState } from "react";

export default function TopPlacesSection() {
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });

  const topPlaces = [
    {
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      title: "Santorini, Greece",
      location: "Greece, Europe",
    },
    {
      img: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff",
      title: "Bali, Indonesia",
      location: "Indonesia, Asia",
    },
    {
      img: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba",
      title: "Swiss Alps, Switzerland",
      location: "Switzerland, Europe",
    },
  ];

  const handleAddToPlan = (place) => {
    const stored = JSON.parse(localStorage.getItem("plan")) || [];
    const exists = stored.some((item) => item.title === place.title);

    if (!exists) {
      const newPlace = {
        ...place,
        id: Date.now(),
        days: [
          { day: "Day 1", desc: "Explore the local culture and landmarks." },
          { day: "Day 2", desc: "Visit top attractions and hidden gems." },
          { day: "Day 3", desc: "Relax and enjoy local cuisine." },
        ],
      };

      stored.push(newPlace);
      localStorage.setItem("plan", JSON.stringify(stored));
      setSnackbar({ open: true, message: `${place.title} added to your plan!`, type: "success" });
    } else {
      setSnackbar({ open: true, message: "This place is already in your plan.", type: "info" });
    }
  };

  return (
    <Box sx={{ textAlign: "center", py: 10, backgroundColor: "#f9f9f9" }}>
      <Typography
        variant="subtitle2"
        sx={{
          textTransform: "uppercase",
          color: "#5E6282",
          fontWeight: 600,
          letterSpacing: 2,
          mb: 1,
        }}
      >
        Top Places
      </Typography>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          color: "#14183E",
          mb: 6,
        }}
      >
        Explore Our Most Popular Destinations
      </Typography>

      <Grid container spacing={5} justifyContent="center">
        {topPlaces.map((place, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card
              sx={{
                borderRadius: "20px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                overflow: "hidden",
                transition: "transform 0.3s ease",
                cursor: "pointer",
                "&:hover": { transform: "translateY(-8px)" },
              }}
            >
              <CardMedia
                component="img"
                height="220"
                image={place.img}
                alt={place.title}
                sx={{ objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#14183E" }}>
                  {place.title}
                </Typography>
                <Typography variant="body2" color="#5E6282">
                  {place.location}
                </Typography>

                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: "#14183E",
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { backgroundColor: "#14186E" },
                  }}
                  onClick={() => handleAddToPlan(place)}
                >
                  Add to Plan
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Snackbar notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.type}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
