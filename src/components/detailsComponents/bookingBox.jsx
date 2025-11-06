import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import axiosInstance from "../../axiousInstance/axoiusInstance";

export default function BookingBox({ place,model }) {
  
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [nights, setNights] = useState(1);
  const [totalPrice, setTotalPrice] = useState(place.price);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const pricePerNight = place.price;

  console.log(model);
  console.log(place._id);
  
  
  // ✅ Get today's date in yyyy-mm-dd format
  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Set default check-in to today
  useEffect(() => {
    const today = getTodayDate();
    setCheckIn(today);
  }, []);

  // Recalculate total price whenever input changes
  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);

      if (end > start) {
        const diffDays = (end - start) / (1000 * 60 * 60 * 24);
        setNights(diffDays);
        
        setTotalPrice(diffDays * guests * pricePerNight);
      } else {
        setNights(0);
        setTotalPrice(0);
      }
    }
    else if(model.toLowerCase()=="experiance"){
      setTotalPrice(1 * guests * pricePerNight);
    }
  }, [checkIn, checkOut, guests]);

  // ✅ Reservation request
  const handleReserve = async () => {
    try {
      setLoading(true);
      setMessage("");

      let payload = {
        checkIn,
        checkOut,
        guestsCount: guests,
      };

      // Detect if it's a hotel or experience
      if (model.toLowerCase() == "hotel") payload.hotelId = place._id;
      else if (model.toLowerCase() == "experiance") payload.experienceId = place._id;

      const res = await axiosInstance.post("/api/reservations", payload);

      setMessage("✅ Reservation successful!");
      console.log("Reservation created:", res.data);
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "❌ Failed to create reservation."
      );
    } finally {
      setLoading(false);
    }
  };

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
        {/* Price Section */}
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: "#222" }}>
          {/* ✅ Price */}
          {totalPrice.toLocaleString()} ج.م{" "}

          {/* ✅ Hotel: show nights */}
          {model?.toLowerCase() === "hotel" && nights > 0 && (
            <Typography component="span" fontSize={15} color="text.secondary">
              for {nights} {nights === 1 ? "night" : "nights"}
            </Typography>
          )}

          {/* ✅ Experience: show guests */}
          {model?.toLowerCase() === "experiance" && guests > 0 && (
            <Typography component="span" fontSize={15} color="text.secondary">
              for {guests} {guests === 1 ? "guest" : "guests"}
            </Typography>
          )}
        </Typography>

        {/* Date & Guests Selection */}
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              label={model.toLowerCase() == "hotel" ? "Check-in" : "Date"}
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: getTodayDate() }}
              fullWidth
            />
            {
              model.toLowerCase() == "hotel" && <TextField
              label="Check-out"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: checkIn || getTodayDate() }}
              fullWidth
            />}
          </Box>

          {
            model.toLowerCase() == "experiance" &&<TextField
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
          </TextField>}

          {/* Reserve Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleReserve}
            disabled={loading}
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
            You won’t be charged yet
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
