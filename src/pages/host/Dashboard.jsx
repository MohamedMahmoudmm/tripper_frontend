import React from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const hostStats = [
    { label: "Your Listings", value: 6 },
    { label: "Reservations", value: 12 },
    { label: "Total Earnings", value: "$3,450" },
  ];

  const recentListings = [
    {
      id: 1,
      title: "Modern Apartment",
      price: 120,
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "Luxury Villa",
      price: 350,
      image:
        "https://images.unsplash.com/photo-1600585154209-3c41e5ef7d2b?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "Cozy Cabin",
      price: 150,
      image:
        "https://images.unsplash.com/photo-1600585154234-1e4b5d0b6b20?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 1100,
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
          bgcolor: "white",
        }}
      >
        {/* Header */}
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ mb: 3, textAlign: "center" }}
        >
          Dashboard
        </Typography>

        <Divider sx={{ mb: 4 }} />

        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {hostStats.map((stat) => (
            <Grid item xs={12} sm={4} key={stat.label}>
              <Card
                sx={{
                  py: 2,
                  borderRadius: 3,
                  textAlign: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
                  transition: "0.3s",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Action Button */}
        <Box
          sx={{
            mb: 5,
            textAlign: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{
              px: 4,
              py: 1,
              fontWeight: 600,
              borderRadius: 3,
              bgcolor: "#FF385C",
              textTransform: "none",
              "&:hover": { bgcolor: "#e22d50" },
            }}
            onClick={() => navigate("/host/add")}
          >
            + Add New Listing
          </Button>
        </Box>

        {/* Recent Listings */}
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 2, textAlign: "left" }}
        >
          Recent Listings
        </Typography>

        <Grid container spacing={3}>
          {recentListings.map((listing) => (
            <Grid item xs={12} sm={6} md={4} key={listing.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.07)",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={listing.image}
                  alt={listing.title}
                />
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {listing.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${listing.price} / night
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard;
