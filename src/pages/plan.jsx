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
  CircularProgress,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  EventNote as PlanIcon,
  MoreVert as MoreIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as BookedIcon,
  Schedule as DraftIcon,
  Hotel as HotelIcon,
  Explore as ExploreIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { planService } from "../services/planService";

const Plans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [bookDialog, setBookDialog] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await planService.getAll();
      setPlans(response);
    } catch (err) {
      console.error("Failed to fetch plans:", err);
      setMessage("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, plan) => {
    setAnchorEl(event.currentTarget);
    setSelectedPlan(plan);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewPlan = () => {
    navigate(`/plans/${selectedPlan._id}`);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialog(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      await planService.delete(selectedPlan._id);
      setMessage("Plan deleted successfully");
      setPlans(plans.filter((p) => p._id !== selectedPlan._id));
      setDeleteDialog(false);
      setSelectedPlan(null);
    } catch (err) {
      console.error("Failed to delete plan:", err);
      setMessage(err.response?.data?.message || "Failed to delete plan");
    }
  };

  const handleBookClick = () => {
    setBookDialog(true);
    handleMenuClose();
  };

  const handleBookConfirm = async () => {
    try {
      const response = await planService.book(selectedPlan._id);
      console.log("Plan booked:", response);
      setMessage("✅ Plan booked successfully! Check My Trips.");
      
      // Update plan status in list
      setPlans(plans.map(p => 
        p._id === selectedPlan._id ? { ...p, status: "booked" } : p
      ));
      
      setBookDialog(false);
      setSelectedPlan(null);
      
      // Navigate to My Trips after 2 seconds
      setTimeout(() => {
        navigate("/my-trips");
      }, 2000);
    } catch (err) {
      console.error("Failed to book plan:", err);
      setMessage(err.response?.data?.message || "Failed to book plan");
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return format(new Date(date), "MMM d, yyyy");
  };

  const calculateNights = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    return Math.ceil(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
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

  return (
    <Container sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            My Travel Plans
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your trip itineraries and bookings
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PlanIcon />}
          onClick={() => navigate("/places")}
          sx={{
            backgroundColor: "#f27244",
            "&:hover": { backgroundColor: "#034959" },
            borderRadius: 2,
            px: 3,
          }}
        >
          Create New Plan
        </Button>
      </Box>

      {message && (
        <Alert
          severity={message.includes("✅") ? "success" : "error"}
          sx={{ mb: 3 }}
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      )}

      {/* Plans Grid */}
      {plans.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <PlanIcon sx={{ fontSize: 80, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No travel plans yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start planning your next adventure!
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/places")}
            sx={{
              backgroundColor: "#f27244",
              "&:hover": { backgroundColor: "#034959" },
            }}
          >
            Browse Places
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {plans.map((plan) => (
            <Grid item xs={12} md={6} lg={4} key={plan._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                {/* Plan Image */}
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    plan.placeId?.images?.[0] ||
                    "/placeholder.jpg"
                  }
                  alt={plan.name}
                  onClick={() => navigate(`/plans/${plan._id}`)}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Header with Status */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {plan.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        📍 {plan.placeId?.name}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        icon={
                          plan.status === "booked" ? (
                            <BookedIcon />
                          ) : (
                            <DraftIcon />
                          )
                        }
                        label={plan.status}
                        size="small"
                        color={plan.status === "booked" ? "success" : "default"}
                      />
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, plan)}
                      >
                        <MoreIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Dates */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    📅 {formatDate(plan.startDate)} -{" "}
                    {formatDate(plan.endDate)}
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ ml: 1, fontWeight: 600 }}
                    >
                      ({calculateNights(plan.startDate, plan.endDate)} nights)
                    </Typography>
                  </Typography>

                  {/* Description */}
                  {plan.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {plan.description}
                    </Typography>
                  )}

                  {/* Stats */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      mb: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    {plan.hotels && plan.hotels.length > 0 && (
                      <Chip
                        icon={<HotelIcon />}
                        label={`${plan.hotels.length} Hotel${
                          plan.hotels.length > 1 ? "s" : ""
                        }`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                    {plan.experiences && plan.experiences.length > 0 && (
                      <Chip
                        icon={<ExploreIcon />}
                        label={`${plan.experiences.length} Experience${
                          plan.experiences.length > 1 ? "s" : ""
                        }`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>

                  {/* Total Price */}
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {plan.totalPrice?.toLocaleString()} ج.م
                  </Typography>
                </CardContent>

                {/* Action Button */}
                <Box sx={{ p: 2, pt: 0 }}>
                  {plan.status === "draft" ? (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        setSelectedPlan(plan);
                        setBookDialog(true);
                      }}
                      sx={{
                        backgroundColor: "#4caf50",
                        "&:hover": { backgroundColor: "#45a049" },
                        borderRadius: 2,
                      }}
                    >
                      Book This Plan
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => navigate(`/plans/${plan._id}`)}
                      sx={{
                        borderRadius: 2,
                        color: "#f27244",
                        borderColor: "#f27244",
                        "&:hover": {
                          backgroundColor: "#fff5f2",
                          borderColor: "#f27244",
                        },
                      }}
                    >
                      View Details
                    </Button>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewPlan}>
          <ViewIcon sx={{ mr: 1 }} /> View Details
        </MenuItem>
        {selectedPlan?.status === "draft" && (
          <MenuItem onClick={handleBookClick}>
            <BookedIcon sx={{ mr: 1 }} /> Book Plan
          </MenuItem>
        )}
        {selectedPlan?.status === "draft" && (
          <MenuItem onClick={handleDeleteClick}>
            <DeleteIcon sx={{ mr: 1 }} /> Delete
          </MenuItem>
        )}
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Plan?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedPlan?.name}"? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Book Confirmation Dialog */}
      <Dialog open={bookDialog} onClose={() => setBookDialog(false)}>
        <DialogTitle>Book This Plan?</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            You're about to book "{selectedPlan?.name}"
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This will create reservations for:
          </Typography>
          <Box sx={{ mt: 2 }}>
            {selectedPlan?.hotels && selectedPlan.hotels.length > 0 && (
              <Typography variant="body2">
                • {selectedPlan.hotels.length} Hotel booking(s)
              </Typography>
            )}
            {selectedPlan?.experiences && selectedPlan.experiences.length > 0 && (
              <Typography variant="body2">
                • {selectedPlan.experiences.length} Experience booking(s)
              </Typography>
            )}
            <Typography variant="body2" fontWeight="bold" sx={{ mt: 2 }}>
              Total: {selectedPlan?.totalPrice?.toLocaleString()} ج.م
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookDialog(false)}>Cancel</Button>
          <Button
            onClick={handleBookConfirm}
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
    </Container>
  );
};

export default Plans;