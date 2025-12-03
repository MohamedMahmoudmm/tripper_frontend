import React from "react";
import { Card, CardContent, Box, Typography, Button } from "@mui/material";
import { Hotel, Celebration, Visibility } from "@mui/icons-material";

const QuickActions = ({ navigate }) => {
  return (
    <Card sx={{ borderRadius: "16px", border: "1px solid #e0e0e0", height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
          Quick Actions
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Hotel />}
            onClick={() => navigate("/host/add-hotel")}
            sx={{
              bgcolor: "#FF385C",
              borderRadius: "12px",
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { bgcolor: "#E31C5F" },
            }}
          >
            Add New Hotel
          </Button>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Celebration />}
            onClick={() => navigate("/host/experiences/add")}
            sx={{
              bgcolor: "#00A699",
              borderRadius: "12px",
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { bgcolor: "#008C80" },
            }}
          >
            Add New Experience
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Visibility />}
            onClick={() => navigate("/host/listings")}
            sx={{
              borderColor: "#e0e0e0",
              color: "#484848",
              borderRadius: "12px",
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { borderColor: "#bdbdbd", bgcolor: "#f8f9fa" },
            }}
          >
            View All Listings
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuickActions;