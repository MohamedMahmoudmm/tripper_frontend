import React, { useEffect, useState } from "react";
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
import hotelService from "../../services/hotels.service";

const Dashboard = () => {
  const navigate = useNavigate();

  const hostStats = [
    { label: "Your Listings", value: 6 },
    { label: "Reservations", value: 12 },
    { label: "Total Earnings", value: "$3,450" },
  ];

  const [recentListings, setRecentListings] = useState([]);
  useEffect(() => {
     hotelService.getHostHotels().then((data) => {
       setRecentListings(data);
     });
  }, [])

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
          sx={{ mb: 3, textAlign: "center" , color: "#034959" }}
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
                    sx={{ mb: 1, color: "#034959" }}
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
              bgcolor: "#f27244",
              textTransform: "none",
              "&:hover": { bgcolor: "#034959" },
            }}
            onClick={() => navigate("/host/listings")}
          >
            + Add New Listing
          </Button>
        </Box>

        {/* Recent Listings */}
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 2, textAlign: "left", color: "#034959" }}
        >
          Recent Listings
        </Typography>

        <Grid container spacing={3}>
          {recentListings.map((listing) => (
            <Grid item xs={12} sm={6} md={4} key={listing._id}>
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
                  image={listing.images[0]}
                  alt={listing.name}
                />
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {listing.name}
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
