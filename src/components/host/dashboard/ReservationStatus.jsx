// components/ReservationStatus.jsx
import React from "react";
import { Card, CardContent, Box, Typography, LinearProgress, alpha } from "@mui/material";

const ReservationStatus = ({ stats }) => {
  const total = stats.totalReservations || 1;
  const confirmedPercent = (stats.confirmedReservations / total) * 100;
  const pendingPercent = (stats.pendingReservations / total) * 100;

  return (
    <Card sx={{ borderRadius: "16px", border: "1px solid #e0e0e0", height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
          Reservation Status
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Confirmed
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {stats.confirmedReservations} ({confirmedPercent.toFixed(0)}%)
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={confirmedPercent}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: alpha("#4caf50", 0.2),
              "& .MuiLinearProgress-bar": { bgcolor: "#4caf50", borderRadius: 4 },
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Pending
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {stats.pendingReservations} ({pendingPercent.toFixed(0)}%)
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={pendingPercent}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: alpha("#ff9800", 0.2),
              "& .MuiLinearProgress-bar": { bgcolor: "#ff9800", borderRadius: 4 },
            }}
          />
        </Box>

        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Cancelled
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {stats.cancelledReservations}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReservationStatus;