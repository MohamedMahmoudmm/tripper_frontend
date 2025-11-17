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

export default function BookingBox({ place, model }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [nights, setNights] = useState(1);
  const [totalPrice, setTotalPrice] = useState(place.price);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);

const pricePerNight = selectedRoom?.price || place.price;

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    if (model.toLowerCase() === "hotel") {
      setCheckIn(getTodayDate());
    }
  }, [model]);

  useEffect(() => {
  if (model.toLowerCase() === "hotel" && place.rooms?.length > 0) {
    setSelectedRoom(place.rooms[0]); // first room
    setTotalPrice(place.rooms[0].price);
  }
}, [place, model]);

  // ✅ Recalculate total price
  useEffect(() => {
    if (checkIn && checkOut && model.toLowerCase() === "hotel") {
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
    } else if (model.toLowerCase() === "experiance") {
      setTotalPrice(1 * guests * pricePerNight);
    }
  }, [checkIn, checkOut, guests, model]);

  // ✅ Reserve function
  const handleReserve = async () => {
    try {
      setLoading(true);
      setMessage("");

      let payload = {
        checkIn,
        checkOut,
        guestsCount: guests,
      };

      if (model.toLowerCase() === "hotel") {
        payload.hotelId = place._id;
        payload.roomId = selectedRoom?._id;   // ← VERY IMPORTANT
      }
      else if (model.toLowerCase() === "experiance") payload.experienceId = place._id;

      const res = await axiosInstance.post("/api/reservations", payload);
      setMessage("✅ Reservation successful!");
      console.log("Reservation created:", res.data);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Failed to create reservation.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Format date nicely (optional)
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
// Filter upcoming dates (today or later)
const upcomingDates = (place.dates || []).filter((d) => {
  const date = new Date(d);
  const today = new Date();
  // Compare only the date part (not time)
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return date >= today;
});
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
          {totalPrice.toLocaleString()} ج.م{" "}
          {model?.toLowerCase() === "hotel" && nights > 0 && (
            <Typography component="span" fontSize={15} color="text.secondary">
              for {nights} {nights === 1 ? "night" : "nights"}
            </Typography>
          )}
          {model?.toLowerCase() === "experiance" && guests > 0 && (
            <Typography component="span" fontSize={15} color="text.secondary">
              for {guests} {guests === 1 ? "guest" : "guests"}
            </Typography>
          )}
        </Typography>
        {/* ROOM SELECTOR */}
        {model.toLowerCase() === "hotel" && place.rooms?.length > 0 && (
          <TextField
            select
            label="Room Type"
            value={selectedRoom?._id || ""}
            onChange={(e) => {
              const room = place.rooms.find((r) => r._id === e.target.value);
              setSelectedRoom(room);
              setTotalPrice(nights * guests * room.price); // recalc
            }}
            fullWidth
            sx={{ mb: 2 }}
          >
            {place.rooms.map((room) => (
              <MenuItem key={room._id} value={room._id}>
                {room.name} — {room.price} ج.م
              </MenuItem>
            ))}
          </TextField>
        )}

        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            {/* ✅ HOTEL MODE: normal date pickers */}
            {model.toLowerCase() === "hotel" && (
              <>
                <TextField
                  label="Check-in"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: getTodayDate() }}
                  fullWidth
                />
                <TextField
                  label="Check-out"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: checkIn || getTodayDate() }}
                  fullWidth
                />
              </>
            )}

            {/* ✅ EXPERIENCE MODE: select available dates */}
            {model.toLowerCase() === "experiance" && (
              <TextField
                select
                label="Available Dates"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                fullWidth
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
            )}

          </Box>

          {model.toLowerCase() === "experiance" && (
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
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={handleReserve}
            disabled={checkIn === ""  || loading}
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
