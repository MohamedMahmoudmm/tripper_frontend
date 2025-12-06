import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import hotelService from "../../services/hotels.service";
import experienceService from "../../services/experince.service";
import { 
  hotelReservationsService, 
  experienceReservationsService 
} from "../../services/reservationsService";

import DashboardHeader from "../../components/host/dashboard/DashboardHeader";
import StatsGrid from "../../components/host/dashboard/StatsGrid";
import ChartsSection from "../../components/host/dashboard/ChartsSection";
import RecentReservations from "../../components/host/dashboard/RecentReservations";
import ReservationStatus from "../../components/host/dashboard/ReservationStatus";
import QuickActions from "../../components/host/dashboard/QuickActions";
import RecentListings from "../../components/host/dashboard/RecentListings";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHotels: 0,
    totalExperiences: 0,
    totalReservations: 0,
    confirmedReservations: 0,
    pendingReservations: 0,
    cancelledReservations: 0,
    totalRevenue: 0,
    recentReservations: [],
  });
  const [recentListings, setRecentListings] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [hotels, experiences] = await Promise.all([
        hotelService.getHostHotels(),
        experienceService.getHostExperiences(),
      ]);

      const [hotelReservationsData, experienceReservationsData] = await Promise.all([
        hotelReservationsService.getAll({ limit: 100 }),
        experienceReservationsService.getAll({ limit: 100 }),
      ]);

      const allReservations = [
        ...(hotelReservationsData?.reservations || []),
        ...(experienceReservationsData?.reservations || []),
      ];

      const confirmed = allReservations.filter(r => r.status === "confirmed").length;
      const pending = allReservations.filter(r => r.status === "pending").length;
      const cancelled = allReservations.filter(r => r.status === "cancelled").length;

      const revenue = allReservations
        .filter(r => r.status === "confirmed")
        .reduce((sum, r) => sum + (r.totalPrice || 0), 0);

      const allListings = [...hotels, ...experiences]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);

      const recentRes = allReservations
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setStats({
        totalHotels: hotels.length,
        totalExperiences: experiences.length,
        totalReservations: allReservations.length,
        confirmedReservations: confirmed,
        pendingReservations: pending,
        cancelledReservations: cancelled,
        totalRevenue: revenue,
        recentReservations: recentRes,
      });

      setRecentListings(allListings);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", bgcolor: "#f8f9fa" }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress sx={{ color: "#FF385C", mb: 2 }} size={48} />
          <Typography color="text.secondary">Loading dashboard...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", pb: 6 }}>
      <Box sx={{  maxWidth: 1400, mx: "auto", p: 4 }}>
        <DashboardHeader />
        <StatsGrid stats={stats} navigate={navigate} />
        <ChartsSection stats={stats} />
        <RecentReservations 
          reservations={stats.recentReservations} 
          navigate={navigate} 
        />
        <Box sx={{ display: "flex", gap: 3, mb: 4, flexDirection: { xs: "column", md: "row" } }}>
          <Box sx={{ flex: 2 }}>
            <ReservationStatus stats={stats} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <QuickActions navigate={navigate} />
          </Box>
        </Box>
        <RecentListings listings={recentListings} navigate={navigate} />
      </Box>
    </Box>
  );
};

export default Dashboard;