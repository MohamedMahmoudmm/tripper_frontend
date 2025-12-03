import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const ChartsSection = ({ stats }) => {
  // Data for charts
  const revenueData = [
    { month: "Jan", revenue: stats.totalRevenue * 0.7 },
    { month: "Feb", revenue: stats.totalRevenue * 0.8 },
    { month: "Mar", revenue: stats.totalRevenue * 0.9 },
    { month: "Apr", revenue: stats.totalRevenue },
  ];

  const statusData = [
    { name: "Confirmed", value: stats.confirmedReservations, color: "#4caf50" },
    { name: "Pending", value: stats.pendingReservations, color: "#ff9800" },
    { name: "Cancelled", value: stats.cancelledReservations, color: "#f44336" },
  ];

  return (
    <Grid  spacing={3} sx={{ mb: 4 }}>
      {/* Revenue Chart */}
      <Grid item xs={12} md={8}>
        <Card sx={{ borderRadius: "16px", border: "1px solid #e0e0e0", height: "100%" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
              Revenue Overview
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: "8px", 
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)" 
                  }} 
                />
                <Bar dataKey="revenue" fill="#FF385C" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Reservation Status Pie Chart */}
      <Grid item xs={12} md={4}>
        <Card sx={{ borderRadius: "16px", border: "1px solid #e0e0e0", height: "100%" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
              Reservations Status
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}>
              {statusData.map((item, index) => (
                <Box key={index} sx={{ textAlign: "center" }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: item.color, mx: "auto", mb: 0.5 }} />
                  <Typography variant="caption" color="text.secondary">{item.name}</Typography>
                  <Typography variant="body2" fontWeight={700}>{item.value}</Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ChartsSection;