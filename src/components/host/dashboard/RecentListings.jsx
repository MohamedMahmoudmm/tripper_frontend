import React from "react";
import { Box, Typography, Button, Grid, Card, CardContent } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";

const RecentListings = ({ listings, navigate }) => {
  if (listings.length === 0) return null;

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" fontWeight={700}>
          Recent Listings
        </Typography>
        <Button
          size="small"
          endIcon={<ArrowForward />}
          onClick={() => navigate("/host/listings")}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          View All
        </Button>
      </Box>
      <Grid container spacing={3}>
        {listings.map((listing) => (
          <Grid item xs={12} sm={6} md={4} key={listing._id}>
            <Card
              sx={{
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid #e0e0e0",
                transition: "all 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                },
              }}
              onClick={() => navigate("/host/listings")}
            >
              <Box
                component="img"
                src={listing.images?.[0] || listing.image || "/placeholder.jpg"}
                alt={listing.name}
                sx={{ width: "100%", height: 200, objectFit: "cover" }}
              />
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" fontWeight={700} noWrap sx={{ mb: 1 }}>
                  {listing.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {listing.address?.city || "Location"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RecentListings;