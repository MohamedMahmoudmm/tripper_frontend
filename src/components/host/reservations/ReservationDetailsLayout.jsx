import React from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Button,
  Stack,
  Card,
  CardContent,
  Rating,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ImageIcon from "@mui/icons-material/Image";

const statusConfig = {
  pending: {
    color: "#FFA726",
    bgColor: "#FFF3E0",
    icon: <HourglassEmptyIcon sx={{ fontSize: 20 }} />,
    label: "Pending Confirmation",
  },
  confirmed: {
    color: "#66BB6A",
    bgColor: "#E8F5E9",
    icon: <CheckCircleIcon sx={{ fontSize: 20 }} />,
    label: "Confirmed",
  },
  cancelled: {
    color: "#EF5350",
    bgColor: "#FFEBEE",
    icon: <CancelIcon sx={{ fontSize: 20 }} />,
    label: "Cancelled",
  },
  completed: {
    color: "#42A5F5",
    bgColor: "#E3F2FD",
    icon: <TaskAltIcon sx={{ fontSize: 20 }} />,
    label: "Completed",
  },
};

const paymentStatusConfig = {
  succeeded: { label: "Paid", color: "#66BB6A", bgColor: "#E8F5E9" },
  unpaid: { label: "Unpaid", color: "#FF9800", bgColor: "#FFF3E0" },
  pending: { label: "Processing", color: "#42A5F5", bgColor: "#E3F2FD" },
};

const ReservationDetailsLayout = ({
  loading,
  reservation,
  title,
  subtitle,
  leftSection,
  rightSection,
  totalPrice,
  viewBtnLabel,
  onViewClick,
  images = [],
  starRating = 0,
  amenities = [],
  showPaymentStatus = true,
}) => {
  const navigate = useNavigate();

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{ backgroundColor: "#F8F9FA" }}
      >
        <CircularProgress size={60} sx={{ color: "#FF385C" }} />
      </Box>
    );

  if (!reservation)
    return (
      <Box
        textAlign="center"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        sx={{ backgroundColor: "#F8F9FA" }}
      >
        <Typography variant="h5" color="text.secondary" mb={2}>
          Reservation not found
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{
            borderColor: "#FF385C",
            color: "#FF385C",
            "&:hover": { borderColor: "#E31C5F", backgroundColor: "#FFF5F7" },
          }}
        >
          Go Back
        </Button>
      </Box>
    );

  const status = statusConfig[reservation.status] || statusConfig.pending;
  const paymentStatus = paymentStatusConfig[reservation.paymentStatus] || paymentStatusConfig.unpaid;

  return (
    <Box sx={{ backgroundColor: "#F8F9FA", minHeight: "100vh", py: { xs: 3, md: 5 } }}>
      <Box maxWidth="1200px" mx="auto" px={{ xs: 2, sm: 3, md: 4 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            color: "#222",
            fontWeight: 600,
            fontSize: "0.95rem",
            mb: 3,
            textTransform: "none",
            "&:hover": { backgroundColor: "#F0F0F0" },
          }}
        >
          Back to Reservations
        </Button>

        {/* Main Content */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            backgroundColor: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          {/* Header Section with Images */}
          <Box>
            {/* Images Gallery */}
            {images && images.length > 0 && (
              <Box
                sx={{
                  height: { xs: "200px", md: "300px" },
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  src={images[0]}
                  alt={title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                {images.length > 1 && (
                  <Chip
                    icon={<ImageIcon />}
                    label={`+${images.length - 1} more`}
                    sx={{
                      position: "absolute",
                      bottom: 16,
                      right: 16,
                      backgroundColor: "rgba(0,0,0,0.7)",
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  />
                )}
              </Box>
            )}

            {/* Header Info */}
            <Box
              sx={{
                background: images?.length > 0 
                  ? "linear-gradient(to bottom, rgba(102, 126, 234, 0.95), rgba(118, 75, 162, 0.95))"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                p: { xs: 3, md: 4 },
                color: "#fff",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "300px",
                  height: "300px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "50%",
                  transform: "translate(30%, -30%)",
                }}
              />
              
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
                <Box sx={{ flex: 1, minWidth: "250px", position: "relative", zIndex: 1 }}>
                  <Typography variant="h4" fontWeight="bold" mb={1} sx={{ fontSize: { xs: "1.75rem", md: "2.125rem" } }}>
                    {title}
                  </Typography>
                  {subtitle && (
                    <Typography sx={{ opacity: 0.95, fontSize: "1rem", mb: 1 }}>
                      {subtitle}
                    </Typography>
                  )}
                  {starRating > 0 && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Rating value={starRating} readOnly size="small" />
                      <Typography sx={{ fontSize: "0.9rem", opacity: 0.9 }}>
                        {starRating} stars
                      </Typography>
                    </Stack>
                  )}
                </Box>
                
                <Stack direction="row" gap={1.5} sx={{ position: "relative", zIndex: 1 }}>
                  <Chip
                    icon={status.icon}
                    label={status.label}
                    sx={{
                      backgroundColor: "#fff",
                      color: status.color,
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      height: "36px",
                      "& .MuiChip-icon": { color: status.color },
                    }}
                  />
                  {showPaymentStatus && (
                    <Chip
                      label={paymentStatus.label}
                      sx={{
                        backgroundColor: "#fff",
                        color: paymentStatus.color,
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        height: "36px",
                      }}
                    />
                  )}
                </Stack>
              </Stack>
            </Box>
          </Box>

          {/* Booking Timeline */}
          <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: "#F8F9FA", borderBottom: "1px solid #E0E0E0" }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3} justifyContent="space-around">
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary">Booking ID</Typography>
                <Typography variant="body2" fontWeight="600">
                  #{reservation._id?.slice(-8).toUpperCase()}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary">Booked On</Typography>
                <Typography variant="body2" fontWeight="600">
                  {new Date(reservation.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Typography>
              </Box>
              {reservation.updatedAt !== reservation.createdAt && (
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="caption" color="text.secondary">Last Updated</Typography>
                  <Typography variant="body2" fontWeight="600">
                    {new Date(reservation.updatedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>

          {/* Content Section */}
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
              {/* Left Section */}
              <Card
                sx={{
                  flex: 1,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  borderRadius: 2,
                  border: "1px solid #E0E0E0",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {leftSection}
                </CardContent>
              </Card>

              {/* Right Section */}
              <Card
                sx={{
                  flex: 1,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  borderRadius: 2,
                  border: "1px solid #E0E0E0",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {rightSection}
                </CardContent>
              </Card>
            </Stack>

            {/* Amenities Section */}
            {amenities && amenities.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Amenities
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {amenities.map((amenity, idx) => (
                    <Chip
                      key={idx}
                      label={amenity}
                      sx={{
                        backgroundColor: "#F0F4FF",
                        color: "#667eea",
                        fontWeight: 500,
                        textTransform: "capitalize",
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Price Section */}
            <Box
              sx={{
                mt: 4,
                p: 3,
                backgroundColor: "#F8F9FA",
                borderRadius: 2,
                border: "2px dashed #E0E0E0",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={2}
              >
                <Typography
                  variant="h6"
                  fontWeight="600"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                >
                  Total Amount
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{
                    color: "#667eea",
                    fontSize: { xs: "1.75rem", md: "2.125rem" },
                  }}
                >
                  ${totalPrice?.toLocaleString()}
                </Typography>
              </Stack>
            </Box>

            {/* Action Button */}
            <Box textAlign="center" mt={4}>
              <Button
                variant="contained"
                size="large"
                onClick={onViewClick}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  borderRadius: "12px",
                  px: { xs: 4, sm: 6 },
                  py: 1.5,
                  textTransform: "none",
                  boxShadow: "0 4px 14px rgba(102, 126, 234, 0.4)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.5)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {viewBtnLabel}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ReservationDetailsLayout;