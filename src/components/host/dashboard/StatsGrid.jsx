import React from "react";
import { Grid } from "@mui/material";
import { Hotel, Celebration, CalendarMonth, AttachMoney } from "@mui/icons-material";
import { alpha } from "@mui/material";
import StatCard from "./StatCard";

const StatsGrid = ({ stats, navigate }) => {
  const statsData = [
    {
      icon: <Hotel />,
      title: "Total Hotels",
      value: stats.totalHotels,
      color: "#FF385C",
      bgColor: alpha("#FF385C", 0.1),
      onClick: () => navigate("/host/listings"),
    },
    {
      icon: <Celebration />,
      title: "Total Experiences",
      value: stats.totalExperiences,
      color: "#00A699",
      bgColor: alpha("#00A699", 0.1),
      onClick: () => navigate("/host/listings"),
    },
    {
      icon: <CalendarMonth />,
      title: "Total Reservations",
      value: stats.totalReservations,
      subtitle: `${stats.pendingReservations} pending approval`,
      color: "#7B61FF",
      bgColor: alpha("#7B61FF", 0.1),
      onClick: () => navigate("/host/reservations"),
    },
    {
      icon: <AttachMoney />,
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      subtitle: "From confirmed bookings",
      color: "#4caf50",
      bgColor: alpha("#4caf50", 0.1),
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {statsData.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatCard {...stat} />
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsGrid;