import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Chip,
  Grid,
} from "@mui/material";
import { Close as CloseIcon, CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiousInstance/axoiusInstance";

export default function BookingBox({ place, model }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Step 1: Room Selection
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomCount, setRoomCount] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [availableRooms, setAvailableRooms] = useState(null);
  const [roomAvailability, setRoomAvailability] = useState({});

  // Step 2: Guest Details
  const [bookingForSelf, setBookingForSelf] = useState(true);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const steps = ["Place & Room Details", "Guest Information", "Confirmation"];

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    if (open && model.toLowerCase() === "hotel") {
      setCheckIn(getTodayDate());
      if (place.rooms?.length > 0) {
        setSelectedRoom(place.rooms[0]);
      }
    }
  }, [open, model, place]);

  // Fetch availability for all rooms
  const fetchRoomAvailability = async (roomId) => {
    if (!roomId) return;

    try {
      const res = await axiosInstance.get("/api/reservations/availability", {
        params: {
          hotelId: place._id,
          roomId: roomId,
        }
      });

      setRoomAvailability(prev => ({
        ...prev,
        [roomId]: res.data.availableDates || []
      }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (open && place.rooms?.length > 0) {
      place.rooms.forEach(room => {
        fetchRoomAvailability(room._id);
      });
    }
  }, [open, place]);

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate step 1
      if (!checkIn || (model.toLowerCase() === "hotel" && !checkOut)) {
        setMessage("Please select dates");
        return;
      }
      if (model.toLowerCase() === "hotel" && place.rooms?.length > 0 && !selectedRoom) {
        setMessage("Please select a room");
        return;
      }
    } else if (activeStep === 1 && !bookingForSelf) {
      // Validate step 2
      if (!guestName || !guestEmail || !guestPhone) {
        setMessage("Please fill all guest details");
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

  const handleReserve = async () => {
    try {
      setLoading(true);
      setMessage("");

      let payload = {
        guestsCount: guests,
        roomCount: 1,
      };

      if (model.toLowerCase() === "hotel") {
        payload.hotelId = place._id;
        if (selectedRoom) {
          payload.roomId = selectedRoom._id;
          payload.roomCount = roomCount;
        }
        payload.checkIn = checkIn;
        payload.checkOut = checkOut;
      } else if (model.toLowerCase() === "experiance") {
        payload.experienceId = place._id;
        payload.checkIn = checkIn;
        payload.checkOut = null;
      }

      if (!bookingForSelf) {
        payload.guestDetails = {
          name: guestName,
          email: guestEmail,
          phone: guestPhone,
        };
      }

      const res = await axiosInstance.post("/api/reservations", payload);
      console.log("Reservation created:", res.data);
      setLoading(false);
      
      // For experience, show success message
      if (model.toLowerCase() === "experiance") {
        setMessage("✅ Reservation created successfully.");
      } else {
        // For hotel, move to success step in wizard
        handleNext();
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Failed to create reservation.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setActiveStep(0);
    setMessage("");
    setSelectedRoom(null);
    setBookingForSelf(true);
    setGuestName("");
    setGuestEmail("");
    setGuestPhone("");
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateNights = () => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      if (end > start) {
        return (end - start) / (1000 * 60 * 60 * 24);
      }
    }
    return 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    
    if (model.toLowerCase() === "hotel") {
      const pricePerNight = selectedRoom?.price || place.price;
      return nights * pricePerNight * roomCount;
    } else if (model.toLowerCase() === "experiance") {
      // Fixed: Multiply price by number of guests for experiences
      return (place.price || 0) * guests;
    }
    return 0;
  };

  const upcomingDates = (place.dates || []).filter((d) => {
    const date = new Date(d);
    const today = new Date();
    date.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return date >= today;
  });

  // Simple experience booking box
  if (model.toLowerCase() === "experiance") {
    return (
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 4,
            width: 340,
            backgroundColor: "#fff",
            position: "sticky",
            top: 100,
          }}
        >
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: "#222" }}>
            {place.price} ج.م{" "}
            <Typography component="span" fontSize={15} color="text.secondary">
              per guest
            </Typography>
          </Typography>

          <Box sx={{ mt: 2 }}>
            <TextField
              select
              label="Available Dates"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            >
              {upcomingDates.length > 0 ? (
                upcomingDates.map((date, idx) => (
                  <MenuItem key={idx} value={date}>
                    {formatDate(date)}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No upcoming dates available</MenuItem>
              )}
            </TextField>

            <TextField
              select
              label="Guests"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              fullWidth
              sx={{ mb: 3 }}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <MenuItem key={num} value={num}>
                  {num} {num === 1 ? "guest" : "guests"}
                </MenuItem>
              ))}
            </TextField>

            {/* Display total price for experience */}
            {guests > 1 && (
              <Paper sx={{ p: 2, mb: 2, backgroundColor: "#f5f5f5" }}>
                <Typography variant="body1" fontWeight={600}>
                  Total: {calculateTotal().toLocaleString()} ج.م
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {place.price} ج.م × {guests} {guests === 1 ? "guest" : "guests"}
                </Typography>
              </Paper>
            )}

            <Button
              variant="contained"
              fullWidth
              onClick={handleReserve}
              disabled={checkIn === "" || loading}
              sx={{
                py: 1.3,
                borderRadius: 3,
                backgroundColor: "#f27244",
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": { backgroundColor: "#034959" },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Reserve"}
            </Button>

            <Typography
              variant="body2"
              textAlign="center"
              color="text.secondary"
              sx={{ mt: 2 }}
            >
              You won't be charged yet
            </Typography>

            {message && (
              <Typography
                variant="body2"
                textAlign="center"
                sx={{ mt: 2, color: message.includes("✅") ? "green" : "red" }}
              >
                {message}
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    );
  }

  // Hotel wizard with floating button
  return (
    <>
      {/* Floating Book Button */}
      <Button
        variant="contained"
        size="large"
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          py: 1.5,
          px: 4,
          borderRadius: 3,
          backgroundColor: "#f27244",
          fontWeight: 600,
          textTransform: "none",
          fontSize: "1.1rem",
          boxShadow: "0 4px 12px rgba(242, 114, 68, 0.4)",
          "&:hover": { 
            backgroundColor: "#034959",
            boxShadow: "0 6px 16px rgba(3, 73, 89, 0.4)",
          },
          zIndex: 1000,
        }}
      >
        Book Now
      </Button>

      {/* Booking Wizard Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            minHeight: "600px",
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5" fontWeight={700}>
              Book Your Stay
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Stepper activeStep={activeStep} sx={{ mt: 2 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </DialogTitle>

        <DialogContent>
          {/* Step 1: Place & Room Details */}
          {activeStep === 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                {place.name || "Place Details"}
              </Typography>

              {/* Hotel with rooms */}
              {model.toLowerCase() === "hotel" && place.rooms?.length > 0 && (
                <>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                    Available Rooms
                  </Typography>
                  
                  {place.rooms.map((room) => (
                    <Card
                      key={room._id}
                      sx={{
                        mb: 2,
                        cursor: "pointer",
                        border: selectedRoom?._id === room._id ? "2px solid #f27244" : "1px solid #e0e0e0",
                        transition: "all 0.3s",
                        "&:hover": {
                          boxShadow: 3,
                        }
                      }}
                      onClick={() => setSelectedRoom(room)}
                    >
                      <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight={600}>
                              {room.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {room.description || "Comfortable room with modern amenities"}
                            </Typography>
                            <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                              {room.price} ج.م <Typography component="span" variant="body2">/ night</Typography>
                            </Typography>
                            
                            {roomAvailability[room._id]?.length > 0 && (
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                                  Available Dates:
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                  {roomAvailability[room._id].slice(0, 5).map((date, idx) => (
                                    <Chip
                                      key={idx}
                                      label={formatDate(date)}
                                      size="small"
                                      color="success"
                                      variant="outlined"
                                    />
                                  ))}
                                  {roomAvailability[room._id].length > 5 && (
                                    <Chip
                                      label={`+${roomAvailability[room._id].length - 5} more`}
                                      size="small"
                                      variant="outlined"
                                    />
                                  )}
                                </Box>
                              </Box>
                            )}
                          </Box>
                          <Radio checked={selectedRoom?._id === room._id} />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}

                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        label="Number of Rooms"
                        value={roomCount}
                        onChange={(e) => setRoomCount(Number(e.target.value))}
                        fullWidth
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <MenuItem key={num} value={num}>
                            {num} {num === 1 ? "room" : "rooms"}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        label="Number of Guests"
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        fullWidth
                      >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <MenuItem key={num} value={num}>
                            {num} {num === 1 ? "guest" : "guests"}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </>
              )}

              {/* Hotel without rooms OR Experience */}
              {(model.toLowerCase() === "hotel" && (!place.rooms || place.rooms.length === 0)) && (
                <>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                    Select Your Dates
                  </Typography>
                  
                  <TextField
                    select
                    label="Number of Guests"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <MenuItem key={num} value={num}>
                        {num} {num === 1 ? "guest" : "guests"}
                      </MenuItem>
                    ))}
                  </TextField>
                </>
              )}

              {/* Date selection for all hotel types */}
              {model.toLowerCase() === "hotel" && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Check-in"
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ min: getTodayDate() }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Check-out"
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ min: checkIn || getTodayDate() }}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              )}

              {/* Show total when dates are selected */}
              {checkIn && (model.toLowerCase() === "experiance" || checkOut) && (
                <Paper sx={{ p: 2, mt: 3, backgroundColor: "#f5f5f5" }}>
                  <Typography variant="h6" fontWeight={600}>
                    Total: {calculateTotal().toLocaleString()} ج.م
                  </Typography>
                  {model.toLowerCase() === "hotel" && calculateNights() > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      {calculateNights()} {calculateNights() === 1 ? "night" : "nights"} 
                      {selectedRoom && ` × ${roomCount} ${roomCount === 1 ? "room" : "rooms"}`}
                      {!selectedRoom && ` × ${guests} ${guests === 1 ? "guest" : "guests"}`}
                    </Typography>
                  )}
                  {model.toLowerCase() === "experiance" && (
                    <Typography variant="body2" color="text.secondary">
                      {place.price} ج.م × {guests} {guests === 1 ? "guest" : "guests"}
                    </Typography>
                  )}
                </Paper>
              )}
            </Box>
          )}

          {/* Step 2: Guest Information */}
          {activeStep === 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Guest Information
              </Typography>

              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <RadioGroup
                  value={bookingForSelf ? "self" : "other"}
                  onChange={(e) => setBookingForSelf(e.target.value === "self")}
                >
                  <FormControlLabel
                    value="self"
                    control={<Radio />}
                    label="I'm booking for myself"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="I'm booking for someone else"
                  />
                </RadioGroup>
              </FormControl>

              {!bookingForSelf && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    label="Guest Full Name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    fullWidth
                    required
                  />
                  <TextField
                    label="Guest Email"
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    fullWidth
                    required
                  />
                  <TextField
                    label="Guest Phone Number"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    fullWidth
                    required
                  />
                </Box>
              )}

              {bookingForSelf && (
                <Paper sx={{ p: 3, backgroundColor: "#e8f5e9", textAlign: "center" }}>
                  <CheckCircleIcon sx={{ fontSize: 48, color: "#4caf50", mb: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    The reservation will be made under your account
                  </Typography>
                </Paper>
              )}
            </Box>
          )}

          {/* Step 3: Success */}
          {activeStep === 2 && (
            <Box sx={{ mt: 4, textAlign: "center", py: 4 }}>
              <CheckCircleIcon sx={{ fontSize: 80, color: "#4caf50", mb: 2 }} />
              <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
                Reservation Successful!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Your reservation has been confirmed. You will receive a confirmation email shortly.
              </Typography>
              
              <Paper sx={{ p: 3, maxWidth: 400, mx: "auto", textAlign: "left" }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Booking Details
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  <strong>Place:</strong> {place.name}
                </Typography>
                {selectedRoom && (
                  <Typography variant="body1">
                    <strong>Room:</strong> {selectedRoom.name}
                  </Typography>
                )}
                <Typography variant="body1">
                  <strong>Check-in:</strong> {formatDate(checkIn)}
                </Typography>
                {checkOut && (
                  <Typography variant="body1">
                    <strong>Check-out:</strong> {formatDate(checkOut)}
                  </Typography>
                )}
                <Typography variant="body1">
                  <strong>Guests:</strong> {guests}
                </Typography>
                <Typography variant="h6" sx={{ mt: 2, color: "#f27244" }}>
                  <strong>Total:</strong> {calculateTotal().toLocaleString()} ج.م
                </Typography>
              </Paper>

              <Button
                variant="contained"
                onClick={handleClose}
                sx={{
                  mt: 3,
                  py: 1.5,
                  px: 4,
                  borderRadius: 3,
                  backgroundColor: "#f27244",
                  "&:hover": { backgroundColor: "#034959" },
                }}
              >
                Close
              </Button>
            </Box>
          )}

          {message && (
            <Typography
              variant="body2"
              textAlign="center"
              sx={{ mt: 2, color: message.includes("✅") ? "green" : "red" }}
            >
              {message}
            </Typography>
          )}

          {/* Navigation Buttons */}
          {activeStep < 2 && (
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{ textTransform: "none" }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={activeStep === 1 ? handleReserve : handleNext}
                disabled={loading}
                sx={{
                  py: 1.2,
                  px: 4,
                  borderRadius: 3,
                  backgroundColor: "#f27244",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#034959" },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : activeStep === 1 ? (
                  "Confirm Reservation"
                ) : (
                  "Next"
                )}
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}