import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Hotel as HotelIcon,
  Explore as ExploreIcon,
  ArrowBack as BackIcon,
  CheckCircle as BookedIcon,
  Schedule as DraftIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { planService } from "../../services/planService";
import { format } from "date-fns";

const PlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [bookDialog, setBookDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);


   const fetchPlanDetails = async () => {
    try {
      setLoading(true);
      const response = await planService.getById(id);
      setPlan(response);
    } catch (err) {
      console.error("Failed to fetch plan details:", err);
      setMessage("Failed to load plan details");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchPlanDetails();
  }, [id]);

 
  const handleBookPlan = async () => {
    try {
      await planService.book(plan._id);
      setMessage("✅ Plan booked successfully! Redirecting to My Trips...");
      setBookDialog(false);
      
      setTimeout(() => {
        navigate("/my-trips");
      }, 2000);
    } catch (err) {
      console.error("Failed to book plan:", err);
      setMessage(err.response?.data?.message || "Failed to book plan");
    }
  };

  const handleDeletePlan = async () => {
    try {
      await planService.delete(plan._id);
      setMessage("Plan deleted successfully");
      setTimeout(() => {
        navigate("/plans");
      }, 1500);
    } catch (err) {
      console.error("Failed to delete plan:", err);
      setMessage(err.response?.data?.message || "Failed to delete plan");
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return format(new Date(date), "MMM d, yyyy");
  };

  const calculateNights = () => {
    if (!plan?.startDate || !plan?.endDate) return 0;
    return Math.ceil(
      (new Date(plan.endDate) - new Date(plan.startDate)) / (1000 * 60 * 60 * 24)
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!plan) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">Plan not found</Alert>
        <Button onClick={() => navigate("/plans")} sx={{ mt: 2 }}>
          Back to Plans
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<BackIcon />}
        onClick={() => navigate("/plans")}
        sx={{ mb: 3 }}
      >
        Back to Plans
      </Button>

      {message && (
        <Alert
          severity={message.includes("✅") ? "success" : "error"}
          sx={{ mb: 3 }}
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      )}

      {/* Plan Header Card */}
      <Card sx={{ mb: 4, borderRadius: 3, overflow: "hidden" }}>
        <CardMedia
          component="img"
          height="400"
          image={plan.placeId?.images?.[0] || "/placeholder.jpg"}
          alt={plan.name}
          sx={{ objectFit: "cover" }}
        />
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              mb: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {plan.name}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                📍 {plan.placeId?.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {plan.placeId?.address?.city}, {plan.placeId?.address?.country}
              </Typography>
            </Box>

            <Chip
              icon={plan.status === "booked" ? <BookedIcon /> : <DraftIcon />}
              label={plan.status.toUpperCase()}
              color={plan.status === "booked" ? "success" : "default"}
              sx={{ fontSize: "1rem", py: 2.5, px: 1 }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Trip Details */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CalendarIcon sx={{ mr: 2, color: "#f27244" }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Travel Dates
                  </Typography>
                  <Typography variant="h6" fontWeight="600">
                    {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {calculateNights()} nights
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PersonIcon sx={{ mr: 2, color: "#034959" }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Guests
                  </Typography>
                  <Typography variant="h6" fontWeight="600">
                    {plan.totalGuests} {plan.totalGuests === 1 ? "Guest" : "Guests"}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {plan.description && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                {plan.description}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>

      {/* Hotels Section */}
      {plan.hotels && plan.hotels.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
            <HotelIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Hotels ({plan.hotels.length})
          </Typography>
          <Grid container spacing={3}>
            {plan.hotels.map((hotelItem, idx) => (
              <Grid item xs={12} md={6} key={idx}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      hotelItem.hotelId?.images?.[0] || "/placeholder.jpg"
                    }
                    alt={hotelItem.hotelId?.name}
                  />
                  <CardContent>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      {hotelItem.hotelId?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      📍 {hotelItem.hotelId?.address?.city}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Check-in: {formatDate(hotelItem.checkIn)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Check-out: {formatDate(hotelItem.checkOut)}
                      </Typography>
                    </Box>

                    {hotelItem.rooms && hotelItem.rooms.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" fontWeight="600" gutterBottom>
                          Rooms:
                        </Typography>
                        {hotelItem.rooms.map((room, roomIdx) => (
                          <Box key={roomIdx} sx={{ ml: 2, mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              • {room.roomCount} room(s) - {room.guestsData?.length} guests
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}

                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {hotelItem.totalPrice?.toLocaleString()} ج.م
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Experiences Section */}
      {plan.experiences && plan.experiences.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
            <ExploreIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Experiences ({plan.experiences.length})
          </Typography>
          <Grid container spacing={3}>
            {plan.experiences.map((expItem, idx) => (
              <Grid item xs={12} md={6} key={idx}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      expItem.experienceId?.images?.[0] || "/placeholder.jpg"
                    }
                    alt={expItem.experienceId?.name}
                  />
                  <CardContent>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      {expItem.experienceId?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      📅 {formatDate(expItem.date)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      👥 {expItem.guestsCount} {expItem.guestsCount === 1 ? "guest" : "guests"}
                    </Typography>

                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" color="secondary" fontWeight="bold">
                      {expItem.totalPrice?.toLocaleString()} ج.م
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Price Summary */}
      <Paper sx={{ p: 4, backgroundColor: "#f5f5f5", mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Price Summary
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        {plan.hotels && plan.hotels.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="body1">Hotels:</Typography>
            <Typography variant="body1" fontWeight="600">
              {plan.hotels
                .reduce((sum, h) => sum + (h.totalPrice || 0), 0)
                .toLocaleString()}{" "}
              ج.م
            </Typography>
          </Box>
        )}

        {plan.experiences && plan.experiences.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="body1">Experiences:</Typography>
            <Typography variant="body1" fontWeight="600">
              {plan.experiences
                .reduce((sum, e) => sum + (e.totalPrice || 0), 0)
                .toLocaleString()}{" "}
              ج.م
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5" fontWeight="bold">
            Total:
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="primary">
            {plan.totalPrice?.toLocaleString()} ج.م
          </Typography>
        </Box>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
        {plan.status === "draft" && (
          <>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialog(true)}
            >
              Delete Plan
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={() => setBookDialog(true)}
              sx={{
                backgroundColor: "#4caf50",
                px: 4,
                py: 1.5,
                "&:hover": { backgroundColor: "#45a049" },
              }}
            >
              Book This Plan
            </Button>
          </>
        )}

        {plan.status === "booked" && (
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/my-trips")}
            sx={{
              backgroundColor: "#f27244",
              px: 4,
              py: 1.5,
              "&:hover": { backgroundColor: "#034959" },
            }}
          >
            View in My Trips
          </Button>
        )}
      </Box>

      {/* Book Confirmation Dialog */}
      <Dialog open={bookDialog} onClose={() => setBookDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            You're about to book this travel plan. This will create reservations for all hotels and experiences.
          </Typography>
          <Box sx={{ mt: 3, p: 2, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Booking Summary:
            </Typography>
            <Typography variant="body2">• {plan.hotels?.length || 0} Hotel booking(s)</Typography>
            <Typography variant="body2">• {plan.experiences?.length || 0} Experience booking(s)</Typography>
            <Typography variant="body2" fontWeight="bold" sx={{ mt: 2 }}>
              Total: {plan.totalPrice?.toLocaleString()} ج.م
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookDialog(false)}>Cancel</Button>
          <Button
            onClick={handleBookPlan}
            variant="contained"
            sx={{
              backgroundColor: "#4caf50",
              "&:hover": { backgroundColor: "#45a049" },
            }}
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Plan?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this plan? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeletePlan} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PlanDetails;