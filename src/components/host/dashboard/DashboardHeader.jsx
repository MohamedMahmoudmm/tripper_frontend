import React from "react";
import { Box, Typography } from "@mui/material";
import { WavingHand } from "@mui/icons-material";

const DashboardHeader = () => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Typography variant="h4" fontWeight={700}>
          Welcome Back!
        </Typography>
        <WavingHand sx={{ fontSize: 32, color: "#FFD700" }} />
      </Box>
      <Typography variant="body1" color="text.secondary">
        Here's what's happening with your properties today
      </Typography>
    </Box>
  );
};

export default DashboardHeader;