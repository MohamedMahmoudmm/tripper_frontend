import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  MenuItem,
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

export default function BookingBox({place}) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [nights, setNights] = useState(1);
  const [totalPrice, setTotalPrice] = useState(place.price);

  const pricePerNight = place.price;

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    const today = getTodayDate();
    setCheckIn(today);
  }, []);

  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);

      if (end > start) {
        const diffTime = end - start;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        setNights(diffDays);
        setTotalPrice(diffDays * guests * pricePerNight);
      } else {
        setNights(0);
        setTotalPrice(0);
      }
    }
  }, [checkIn, checkOut, guests]);

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
          {nights > 0 && (
            <Typography component="span" fontSize={15} color="text.secondary">
              for {nights} {nights === 1 ? "night" : "nights"}
            </Typography>
          )}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              label="Check-in"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: getTodayDate(),
              }}
              fullWidth
            />
            <TextField
              label="Check-out"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: checkIn || getTodayDate(),
              }}
              fullWidth
            />
          </Box>

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

          <Button
            variant="contained"
            fullWidth
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
            Reserve
          </Button>

          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            sx={{ mt: 2 }}
          >
            You won’t be charged yet
          </Typography>
        </Box>

        
      </Paper>
    </Box>
  );
}
