import React from "react";
import { Card, CardContent, Box, Typography, Button, Grid, Chip, Avatar, alpha } from "@mui/material";
import { ArrowForward, CalendarMonth, CheckCircle, Pending, Cancel } from "@mui/icons-material";

const RecentReservations = ({ reservations, navigate }) => {
  const statusConfig = {
    confirmed: { color: "#4caf50", icon: <CheckCircle />, label: "Confirmed" },
    pending: { color: "#ff9800", icon: <Pending />, label: "Pending" },
    cancelled: { color: "#f44336", icon: <Cancel />, label: "Cancelled" },
  };

  return (
    <Card sx={{ borderRadius: "16px", border: "1px solid #e0e0e0", mb: 4 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6" fontWeight={700}>
            Recent Reservations
          </Typography>
          <Button
            size="small"
            endIcon={<ArrowForward />}
            onClick={() => navigate("/host/reservations")}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            View All
          </Button>
        </Box>

        {reservations.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CalendarMonth sx={{ fontSize: 48, color: "#bdbdbd", mb: 1 }} />
            <Typography color="text.secondary">No reservations yet</Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {reservations.map((reservation) => {
              const config = statusConfig[reservation.status] || statusConfig.pending;
              const listingName = reservation.hotelId?.name || 
                                 reservation.experienceId?.name || 
                                 "Unknown Listing";
              const guestName = reservation.guestId?.name || "Guest";
              const checkInDate = reservation.checkIn 
                ? new Date(reservation.checkIn).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })
                : 'N/A';

              return (
                <Grid item xs={12} sm={6} md={4} lg={2.4} key={reservation._id}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      bgcolor: "#f8f9fa",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": { 
                        bgcolor: "#f0f0f0",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      },
                    }}
                    onClick={() => navigate("/host/reservations")}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                      <Avatar sx={{ bgcolor: alpha(config.color, 0.2), color: config.color, width: 36, height: 36 }}>
                        {React.cloneElement(config.icon, { sx: { fontSize: 20 } })}
                      </Avatar>
                      <Chip
                        label={config.label}
                        size="small"
                        sx={{
                          bgcolor: alpha(config.color, 0.1),
                          color: config.color,
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          height: 22,
                        }}
                      />
                    </Box>
                    <Typography 
                      variant="body2" 
                      fontWeight={700} 
                      sx={{ 
                        mb: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        minHeight: "2.5em",
                      }}
                    >
                      {listingName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                      👤 {guestName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                      📅 {checkInDate}
                    </Typography>
                    <Typography variant="body2" fontWeight={700} color="#FF385C" sx={{ mt: "auto" }}>
                      ${reservation.totalPrice}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentReservations;