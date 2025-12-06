import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Paper,
  IconButton,
  Chip,
  Divider,
  Alert,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Hotel as HotelIcon,
  Explore as ExploreIcon,
} from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useLocation, useNavigate } from "react-router-dom";
import { planService } from "../../services/planService";

const PlanCreate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { place, hotels, experiences } = location.state || {};

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Plan data
  const [planName, setPlanName] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [selectedExperiences, setSelectedExperiences] = useState([]);

  const steps = ["Plan Details", "Select Hotels", "Select Experiences", "Review & Create"];

  useEffect(() => {
    if (!place) {
      navigate("/places");
    }
  }, [place, navigate]);

  const handleNext = () => {
    if (activeStep === 0) {
      if (!planName || !startDate || !endDate) {
        setMessage("Please fill all required fields");
        return;
      }
      if (startDate >= endDate) {
        setMessage("End date must be after start date");
        return;
      }
    }
    setMessage("");
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setMessage("");
  };

  const handleAddHotel = (hotel) => {
    // Check if already added
    if (selectedHotels.some((h) => h.hotelId === hotel._id)) {
      setMessage("Hotel already added");
      return;
    }

    // Simple version - add with basic data
    // In real app, open dialog to select rooms, dates, guests
    const hotelData = {
      hotelId: hotel._id,
      hotelName: hotel.name,
      hotelImage: hotel.images?.[0],
      checkIn: startDate,
      checkOut: endDate,
      rooms: [], // Will be filled in detailed version
      totalPrice: hotel.price * calculateNights(),
    };

    setSelectedHotels([...selectedHotels, hotelData]);
    setMessage("");
  };

  const handleRemoveHotel = (hotelId) => {
    setSelectedHotels(selectedHotels.filter((h) => h.hotelId !== hotelId));
  };

  const handleAddExperience = (exp) => {
    if (selectedExperiences.some((e) => e.experienceId === exp._id)) {
      setMessage("Experience already added");
      return;
    }

    // Simple version
    const expData = {
      experienceId: exp._id,
      expName: exp.name,
      expImage: exp.images?.[0],
      date: startDate,
      guestsCount: 1, // Default
      totalPrice: exp.price,
    };

    setSelectedExperiences([...selectedExperiences, expData]);
    setMessage("");
  };

  const handleRemoveExperience = (expId) => {
    setSelectedExperiences(selectedExperiences.filter((e) => e.experienceId !== expId));
  };

  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = () => {
    const hotelTotal = selectedHotels.reduce((sum, h) => sum + h.totalPrice, 0);
    const expTotal = selectedExperiences.reduce((sum, e) => sum + e.totalPrice, 0);
    return hotelTotal + expTotal;
  };

  const handleCreatePlan = async () => {
    try {
      setLoading(true);
      setMessage("");

      const planData = {
        placeId: place._id,
        name: planName,
        description: planDescription,
        startDate,
        endDate,
        hotels: selectedHotels.map((h) => ({
          hotelId: h.hotelId,
          checkIn: h.checkIn,
          checkOut: h.checkOut,
          rooms: h.rooms || [],
          totalPrice: h.totalPrice,
        })),
        experiences: selectedExperiences.map((e) => ({
          experienceId: e.experienceId,
          date: e.date,
          guestsCount: e.guestsCount,
          totalPrice: e.totalPrice,
        })),
      };

      const response = await planService.create(planData);
      console.log("Plan created:", response);
      
      setMessage("✅ Plan created successfully!");
      setTimeout(() => {
        navigate("/plans");
      }, 2000);
    } catch (err) {
      console.error("Failed to create plan:", err);
      setMessage(err.response?.data?.message || "❌ Failed to create plan");
    } finally {
      setLoading(false);
    }
  };

  if (!place) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Create Travel Plan for {place.name}
        </Typography>

        <Stepper activeStep={activeStep} sx={{ my: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step 0: Plan Details */}
        {activeStep === 0 && (
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Basic Information
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="Plan Name *"
                  fullWidth
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="e.g., Giza Weekend Adventure"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={planDescription}
                  onChange={(e) => setPlanDescription(e.target.value)}
                  placeholder="Describe your trip..."
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date *"
                  value={startDate}
                  onChange={setStartDate}
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                  minDate={new Date()}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date *"
                  value={endDate}
                  onChange={setEndDate}
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                  minDate={startDate || new Date()}
                />
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Step 1: Select Hotels */}
        {activeStep === 1 && (
          <Box>
            {selectedHotels.length > 0 && (
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Selected Hotels ({selectedHotels.length})
                </Typography>
                {selectedHotels.map((hotel) => (
                  <Card key={hotel.hotelId} sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                    <Box
                      component="img"
                      src={hotel.hotelImage || "/placeholder.jpg"}
                      sx={{ width: 100, height: 100, objectFit: "cover" }}
                    />
                    <CardContent sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight="600">
                        {hotel.hotelName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {calculateNights()} nights • {hotel.totalPrice} ج.م
                      </Typography>
                    </CardContent>
                    <IconButton onClick={() => handleRemoveHotel(hotel.hotelId)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Card>
                ))}
              </Paper>
            )}

            <Typography variant="h6" fontWeight="600" gutterBottom>
              Available Hotels in {place.address?.city}
            </Typography>
            <Grid container spacing={2}>
              {hotels && hotels.length > 0 ? (
                hotels.map((hotel) => (
                  <Grid item xs={12} sm={6} md={4} key={hotel._id}>
                    <Card>
                      <Box
                        component="img"
                        src={hotel.images?.[0] || "/placeholder.jpg"}
                        sx={{ width: "100%", height: 150, objectFit: "cover" }}
                      />
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                          {hotel.name}
                        </Typography>
                        <Chip label={`${hotel.price} ج.م/night`} size="small" color="primary" />
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => handleAddHotel(hotel)}
                          sx={{ mt: 2 }}
                          disabled={selectedHotels.some((h) => h.hotelId === hotel._id)}
                        >
                          Add to Plan
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Alert severity="info">No hotels available in this area</Alert>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* Step 2: Select Experiences */}
        {activeStep === 2 && (
          <Box>
            {selectedExperiences.length > 0 && (
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Selected Experiences ({selectedExperiences.length})
                </Typography>
                {selectedExperiences.map((exp) => (
                  <Card key={exp.experienceId} sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                    <Box
                      component="img"
                      src={exp.expImage || "/placeholder.jpg"}
                      sx={{ width: 100, height: 100, objectFit: "cover" }}
                    />
                    <CardContent sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight="600">
                        {exp.expName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {exp.guestsCount} guest(s) • {exp.totalPrice} ج.م
                      </Typography>
                    </CardContent>
                    <IconButton onClick={() => handleRemoveExperience(exp.experienceId)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Card>
                ))}
              </Paper>
            )}

            <Typography variant="h6" fontWeight="600" gutterBottom>
              Available Experiences in {place.address?.city}
            </Typography>
            <Grid container spacing={2}>
              {experiences && experiences.length > 0 ? (
                experiences.map((exp) => (
                  <Grid item xs={12} sm={6} md={4} key={exp._id}>
                    <Card>
                      <Box
                        component="img"
                        src={exp.images?.[0] || "/placeholder.jpg"}
                        sx={{ width: "100%", height: 150, objectFit: "cover" }}
                      />
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                          {exp.name}
                        </Typography>
                        <Chip label={`${exp.price} ج.م/person`} size="small" color="secondary" />
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => handleAddExperience(exp)}
                          sx={{ mt: 2 }}
                          disabled={selectedExperiences.some((e) => e.experienceId === exp._id)}
                        >
                          Add to Plan
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Alert severity="info">No experiences available in this area</Alert>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* Step 3: Review */}
        {activeStep === 3 && (
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Review Your Plan
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    {planName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {planDescription}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    📅 {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()} ({calculateNights()} nights)
                  </Typography>
                </Box>

                {selectedHotels.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                      <HotelIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                      Hotels ({selectedHotels.length})
                    </Typography>
                    {selectedHotels.map((hotel) => (
                      <Typography key={hotel.hotelId} variant="body2" sx={{ ml: 4, mb: 1 }}>
                        • {hotel.hotelName} - {hotel.totalPrice} ج.م
                      </Typography>
                    ))}
                  </Box>
                )}

                {selectedExperiences.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                      <ExploreIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                      Experiences ({selectedExperiences.length})
                    </Typography>
                    {selectedExperiences.map((exp) => (
                      <Typography key={exp.experienceId} variant="body2" sx={{ ml: 4, mb: 1 }}>
                        • {exp.expName} - {exp.totalPrice} ج.م
                      </Typography>
                    ))}
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, bgcolor: "#f5f5f5" }}>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Price Summary
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2">Hotels:</Typography>
                    <Typography variant="body2">
                      {selectedHotels.reduce((sum, h) => sum + h.totalPrice, 0)} ج.م
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="body2">Experiences:</Typography>
                    <Typography variant="body2">
                      {selectedExperiences.reduce((sum, e) => sum + e.totalPrice, 0)} ج.م
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" fontWeight="bold">
                      Total:
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {calculateTotalPrice()} ج.م
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        )}

        {message && (
          <Alert severity={message.includes("✅") ? "success" : "error"} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}

        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button onClick={handleBack} disabled={activeStep === 0 || loading}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={activeStep === 3 ? handleCreatePlan : handleNext}
            disabled={loading}
            sx={{
              backgroundColor: "#f27244",
              "&:hover": { backgroundColor: "#034959" },
            }}
          >
            {loading ? "Creating..." : activeStep === 3 ? "Create Plan" : "Next"}
          </Button>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default PlanCreate;