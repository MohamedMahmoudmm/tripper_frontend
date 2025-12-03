import React from "react";
import { Card, CardContent, Box, Typography } from "@mui/material";

const StatCard = ({ icon, title, value, subtitle, color, bgColor, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      borderRadius: "16px",
      border: "1px solid #e0e0e0",
      transition: "all 0.3s ease",
      cursor: onClick ? "pointer" : "default",
      height: "100%",
      "&:hover": onClick ? {
        transform: "translateY(-4px)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      } : {},
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "12px",
            bgcolor: bgColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {React.cloneElement(icon, { sx: { fontSize: 28, color } })}
        </Box>
      </Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" fontWeight={600}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

export default StatCard;