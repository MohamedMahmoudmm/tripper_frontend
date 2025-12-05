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
  Grid,
  useTheme,
  alpha,
  Divider,
  Chip,
} from "@mui/material";
import { 
  Close as CloseIcon, 
  CheckCircle as CheckCircleIcon,
  ChevronLeft,
  ChevronRight,
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addMonths, subMonths, isSameDay, isWithinInterval, isBefore, isAfter, startOfDay } from 'date-fns';
import axiosInstance from "../../axiousInstance/axoiusInstance";

// Integrated Calendar Component (نفس الكود اللي كان موجود)
const BookingCalendar = ({ availableDates = [], onDateSelect, selectedRange }) => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState(null);

  const isDateAvailable = (date) => {
    const checkDate = startOfDay(date);
    if (availableDates.length === 0) return false;
    
    return availableDates.some(range => {
      const rangeStart = startOfDay(range.start);
      const rangeEnd = startOfDay(range.end);
      
      return (
        (isAfter(checkDate, rangeStart) || isSameDay(checkDate, rangeStart)) &&
        (isBefore(checkDate, rangeEnd) || isSameDay(checkDate, rangeEnd))
      );
    });
  };

  const isDateSelected = (date) => {
    if (!selectedRange.start) return false;
    if (selectedRange.end) {
      return isWithinInterval(date, { 
        start: selectedRange.start, 
        end: selectedRange.end 
      });
    }
    return isSameDay(date, selectedRange.start);
  };

  const isStartDate = (date) => {
    return selectedRange.start && isSameDay(date, selectedRange.start);
  };

  const isEndDate = (date) => {
    return selectedRange.end && isSameDay(date, selectedRange.end);
  };

  const isInSelectionRange = (date) => {
    if (!selectedRange.start || !hoveredDate || selectedRange.end) return false;
    
    const start = selectedRange.start;
    const end = hoveredDate;
    
    return isWithinInterval(date, {
      start: start < end ? start : end,
      end: start < end ? end : start
    });
  };

  const handleDateClick = (date) => {
    const normalizedDate = startOfDay(date);
    
    if (!isDateAvailable(normalizedDate)) return;

    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      onDateSelect({ start: normalizedDate, end: null });
    } else {
      if (isBefore(normalizedDate, selectedRange.start)) {
        onDateSelect({ start: normalizedDate, end: selectedRange.start });
      } else {
        onDateSelect({ start: selectedRange.start, end: normalizedDate });
      }
    }
  };

  const handleDateHover = (date) => {
    if (selectedRange.start && !selectedRange.end) {
      setHoveredDate(date);
    }
  };

  const navigateMonths = (direction) => {
    setCurrentMonth(current => 
      direction === 'next' ? addMonths(current, 1) : subMonths(current, 1)
    );
  };

  const CustomDay = (props) => {
    const { day, outsideCurrentMonth, ...other } = props;
    const date = day;
    const available = isDateAvailable(date);
    const selected = isDateSelected(date);
    const isStart = isStartDate(date);
    const isEnd = isEndDate(date);
    const inSelectionRange = isInSelectionRange(date);
    const isToday = isSameDay(date, new Date());

    return (
      <Box
        {...other}
        sx={{
          position: 'relative',
          height: 40,
          width: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: available ? 'pointer' : 'not-allowed',
          opacity: outsideCurrentMonth ? 0.3 : 1,
          '&:hover': {
            backgroundColor: available ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
            borderRadius: '50%'
          },
          ...(inSelectionRange && {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
          }),
          ...(isStart && !isEnd && inSelectionRange && {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0
          }),
          ...(isEnd && !isStart && inSelectionRange && {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0
          }),
          ...(inSelectionRange && !isStart && !isEnd && {
            borderRadius: 0
          })
        }}
        onClick={() => handleDateClick(date)}
        onMouseEnter={() => handleDateHover(date)}
      >
        <Box
          sx={{
            height: 36,
            width: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            position: 'relative',
            zIndex: 1,
            ...(selected && {
              backgroundColor: '#f27244',
              color: '#fff',
              fontWeight: 'bold'
            }),
            ...(isToday && !selected && {
              border: `2px solid ${theme.palette.text.primary}`
            }),
            ...(!available && {
              color: theme.palette.text.disabled,
              textDecoration: 'line-through'
            })
          }}
        >
          {format(date, 'd')}
        </Box>
        
        {inSelectionRange && (isStart || isEnd) && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: isStart ? '50%' : 0,
              right: isEnd ? '50%' : 0,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              zIndex: 0
            }}
          />
        )}
      </Box>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <IconButton onClick={() => navigateMonths('prev')}>
          <ChevronLeft />
        </IconButton>
        
        <Box sx={{ display: 'flex', gap: 6 }}>
          <Typography variant="h6" fontWeight="600">
            {format(currentMonth, 'MMMM yyyy')}
          </Typography>
          <Typography variant="h6" fontWeight="600">
            {format(addMonths(currentMonth, 1), 'MMMM yyyy')}
          </Typography>
        </Box>

        <IconButton onClick={() => navigateMonths('next')}>
          <ChevronRight />
        </IconButton>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <DateCalendar
            value={null}
            onChange={() => {}}
            referenceDate={currentMonth}
            reduceAnimations
            slots={{ day: CustomDay }}
            sx={{
              width: '100%',
              '& .MuiDayCalendar-header': {
                justifyContent: 'space-around',
                '& .MuiDayCalendar-weekDayLabel': {
                  height: 40,
                  width: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 500,
                  color: theme.palette.text.secondary
                }
              },
              '& .MuiDayCalendar-monthContainer': {
                '& .MuiDayCalendar-weekContainer': {
                  justifyContent: 'space-around'
                }
              }
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <DateCalendar
            value={null}
            onChange={() => {}}
            referenceDate={addMonths(currentMonth, 1)}
            reduceAnimations
            slots={{ day: CustomDay }}
            sx={{
              width: '100%',
              '& .MuiDayCalendar-header': {
                justifyContent: 'space-around',
                '& .MuiDayCalendar-weekDayLabel': {
                  height: 40,
                  width: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 500,
                  color: theme.palette.text.secondary
                }
              },
              '& .MuiDayCalendar-monthContainer': {
                '& .MuiDayCalendar-weekContainer': {
                  justifyContent: 'space-around'
                }
              }
            }}
          />
        </Grid>
      </Grid>

      {selectedRange.start && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            onClick={() => onDateSelect({ start: null, end: null })}
            sx={{ 
              color: 'text.secondary',
              textTransform: 'none',
              '&:hover': {
                color: 'text.primary',
              }
            }}
          >
            Clear dates
          </Button>
        </Box>
      )}
    </Box>
  );
};

// Main Booking Component
export default function BookingBox({ place, model }) {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Date selection
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
  const [availableDates, setAvailableDates] = useState([]);

  // Multi-room management
  const [selectedRooms, setSelectedRooms] = useState([]);
  
  // Current room being added
  const [currentRoom, setCurrentRoom] = useState(null);
  const [currentRoomCount, setCurrentRoomCount] = useState(1);
  const [currentGuests, setCurrentGuests] = useState([{ name: "", email: "", phone: "" }]);

  const steps = ["Select Dates", "Add Rooms", "Review & Confirm", "Success"];

  // Fetch available dates
  const fetchAvailableDates = async (hotelId, roomId = null) => {
    try {
      const params = new URLSearchParams({ hotelId });
      if (roomId) params.append('roomId', roomId);
      
      const res = await axiosInstance.get(`/api/reservations/availableDates?${params}`);
      
      const ranges = res.data.map(range => ({
        start: startOfDay(new Date(range.start)),
        end: startOfDay(new Date(range.end))
      }));
      
      return ranges;
    } catch (err) {
      console.error("Error fetching available dates:", err);
      return [];
    }
  };

  useEffect(() => {
    if (open && place?._id) {
      const loadDates = async () => {
        setAvailableDates([]);
        const ranges = await fetchAvailableDates(place._id);
        setAvailableDates(ranges);
      };
      loadDates();
    }
  }, [open, place?._id]);

  const handleDateSelect = (range) => {
    setSelectedRange(range);
  };

  const handleAddGuest = () => {
    if (currentRoom && currentGuests.length < currentRoom.maxGuests * currentRoomCount) {
      setCurrentGuests([...currentGuests, { name: "", email: "", phone: "" }]);
    }
  };

  const handleRemoveGuest = (index) => {
    if (currentGuests.length > 1) {
      setCurrentGuests(currentGuests.filter((_, i) => i !== index));
    }
  };

  const handleGuestChange = (index, field, value) => {
    const updated = [...currentGuests];
    updated[index][field] = value;
    setCurrentGuests(updated);
  };

  const handleAddRoom = () => {
    // Validation
    if (!currentRoom) {
      setMessage("Please select a room");
      return;
    }

    if (currentGuests.length === 0) {
      setMessage("Please add at least one guest");
      return;
    }

    // Check all guests have name and phone
    const allValid = currentGuests.every(g => g.name.trim() && g.phone.trim());
    if (!allValid) {
      setMessage("Please fill name and phone for all guests");
      return;
    }

    // Add room to selection
    setSelectedRooms([
      ...selectedRooms,
      {
        room: currentRoom,
        roomCount: currentRoomCount,
        guestsData: [...currentGuests]
      }
    ]);

    // Reset current selection
    setCurrentRoom(null);
    setCurrentRoomCount(1);
    setCurrentGuests([{ name: "", email: "", phone: "" }]);
    setMessage("");
  };

  const handleRemoveRoom = (index) => {
    setSelectedRooms(selectedRooms.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!selectedRange.start || !selectedRange.end) {
        setMessage("Please select check-in and check-out dates");
        return;
      }
    } else if (activeStep === 1) {
      if (selectedRooms.length === 0) {
        setMessage("Please add at least one room");
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
    if (JSON.parse(localStorage.getItem("user")) === null) {
      setMessage("Please login to make a reservation.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const payload = {
        hotelId: place._id,
        rooms: selectedRooms.map(item => ({
          roomId: item.room._id,
          roomCount: item.roomCount,
          guestsData: item.guestsData
        })),
        checkIn: selectedRange.start,
        checkOut: selectedRange.end,
      };

      const res = await axiosInstance.post("/api/reservations", payload);
      console.log("Reservation created:", res.data);
      setLoading(false);
      handleNext(); // Move to success step
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
    setSelectedRange({ start: null, end: null });
    setSelectedRooms([]);
    setCurrentRoom(null);
    setCurrentRoomCount(1);
    setCurrentGuests([{ name: "", email: "", phone: "" }]);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return format(date, 'MMM d, yyyy');
  };

  const calculateNights = () => {
    if (selectedRange.start && selectedRange.end) {
      return Math.ceil((selectedRange.end - selectedRange.start) / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return selectedRooms.reduce((total, item) => {
      return total + (nights * item.room.price * item.roomCount);
    }, 0);
  };

  const getTotalGuests = () => {
    return selectedRooms.reduce((total, item) => {
      return total + item.guestsData.length;
    }, 0);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 4 }}>
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
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              minHeight: "700px",
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
            {/* Step 0: Select Dates */}
            {activeStep === 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  {place.name} - {place.address.city}, {place.address.country}
                </Typography>
                
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  Select Your Dates
                </Typography>

                {availableDates.length === 0 && (
                  <Paper sx={{ p: 2, mb: 2, backgroundColor: "#fff3e0" }}>
                    <Typography variant="body2" color="text.secondary">
                      Loading available dates...
                    </Typography>
                  </Paper>
                )}
                
                <Paper sx={{ p: 2, mb: 2, backgroundColor: "#f5f5f5" }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Selected Dates:
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedRange.start && selectedRange.end
                      ? `${formatDate(selectedRange.start)} - ${formatDate(selectedRange.end)} (${calculateNights()} nights)`
                      : selectedRange.start
                      ? `${formatDate(selectedRange.start)} - Select checkout date`
                      : "Click on calendar to select dates"}
                  </Typography>
                </Paper>

                <BookingCalendar
                  availableDates={availableDates}
                  onDateSelect={handleDateSelect}
                  selectedRange={selectedRange}
                />
              </Box>
            )}

            {/* Step 1: Add Rooms */}
            {activeStep === 1 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Add Rooms to Your Booking
                </Typography>

                {/* Added Rooms Summary */}
                {selectedRooms.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                      Selected Rooms ({selectedRooms.length})
                    </Typography>
                    {selectedRooms.map((item, idx) => (
                      <Card key={idx} sx={{ mb: 2, border: "1px solid #e0e0e0" }}>
                        <CardContent>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" fontWeight={600}>
                                {item.room.name} × {item.roomCount}
                              </Typography>
                              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                                <Chip 
                                  icon={<PersonIcon />} 
                                  label={`${item.guestsData.length} guests`} 
                                  size="small" 
                                />
                                <Chip 
                                  label={`${item.room.price} ج.م/night`}
                                  size="small"
                                  color="primary"
                                />
                              </Box>
                            </Box>
                            <IconButton onClick={() => handleRemoveRoom(idx)} color="error">
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                    <Divider sx={{ my: 3 }} />
                  </Box>
                )}

                {/* Add New Room Section */}
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  {selectedRooms.length > 0 ? "Add Another Room" : "Select a Room"}
                </Typography>

                {/* Room Selection Cards */}
                {place.rooms && place.rooms.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    {place.rooms.map((room) => (
                      <Card
                        key={room._id}
                        sx={{
                          mb: 2,
                          cursor: "pointer",
                          border: currentRoom?._id === room._id ? "2px solid #f27244" : "1px solid #e0e0e0",
                          transition: "all 0.3s",
                          "&:hover": {
                            boxShadow: 3,
                          }
                        }}
                        onClick={() => setCurrentRoom(room)}
                      >
                        <CardContent>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" fontWeight={600}>
                                {room.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {room.description}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Max guests: {room.maxGuests} per room
                              </Typography>
                              <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                                {room.price} ج.م <Typography component="span" variant="body2">/ night</Typography>
                              </Typography>
                            </Box>
                            <Radio checked={currentRoom?._id === room._id} />
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}

                {/* Room Count & Guest Forms - Only show if room selected */}
                {currentRoom && (
                  <>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          select
                          label="Number of This Room Type"
                          value={currentRoomCount}
                          onChange={(e) => setCurrentRoomCount(Number(e.target.value))}
                          fullWidth
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <MenuItem key={num} value={num}>
                              {num} {num === 1 ? "room" : "rooms"}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>

                    {/* Guest Information Forms */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Guest Information ({currentGuests.length}/{currentRoom.maxGuests * currentRoomCount})
                        </Typography>
                        <Button
                          startIcon={<AddIcon />}
                          onClick={handleAddGuest}
                          disabled={currentGuests.length >= currentRoom.maxGuests * currentRoomCount}
                          sx={{ textTransform: "none" }}
                        >
                          Add Guest
                        </Button>
                      </Box>

                      {currentGuests.map((guest, index) => (
                        <Card key={index} sx={{ mb: 2, p: 2, backgroundColor: "#f9f9f9" }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Guest {index + 1}
                            </Typography>
                            {currentGuests.length > 1 && (
                              <IconButton size="small" onClick={() => handleRemoveGuest(index)} color="error">
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                label="Full Name *"
                                value={guest.name}
                                onChange={(e) => handleGuestChange(index, "name", e.target.value)}
                                fullWidth
                                size="small"
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                label="Email"
                                type="email"
                                value={guest.email}
                                onChange={(e) => handleGuestChange(index, "email", e.target.value)}
                                fullWidth
                                size="small"
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                label="Phone *"
                                value={guest.phone}
                                onChange={(e) => handleGuestChange(index, "phone", e.target.value)}
                                fullWidth
                                size="small"
                              />
                            </Grid>
                          </Grid>
                        </Card>
                      ))}
                    </Box>

                    {/* Add This Room Button */}
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleAddRoom}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        backgroundColor: "#4caf50",
                        "&:hover": { backgroundColor: "#45a049" },
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Add This Room to Booking
                    </Button>
                  </>
                )}
              </Box>
            )}

            {/* Step 2: Review & Confirm */}
            {activeStep === 2 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                  Review Your Booking
                </Typography>

                {/* Booking Summary */}
                <Paper sx={{ p: 3, mb: 3, backgroundColor: "#f5f5f5" }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    {place.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(selectedRange.start)} - {formatDate(selectedRange.end)} ({calculateNights()} nights)
                  </Typography>
                </Paper>

                {/* Rooms Breakdown */}
                {selectedRooms.map((item, idx) => (
                  <Card key={idx} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {item.room.name} × {item.roomCount}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {item.room.price} ج.م × {calculateNights()} nights × {item.roomCount} rooms = {item.room.price * calculateNights() * item.roomCount} ج.م
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Guests ({item.guestsData.length}):
                      </Typography>
                      {item.guestsData.map((guest, guestIdx) => (
                        <Typography key={guestIdx} variant="body2" color="text.secondary">
                          {guestIdx + 1}. {guest.name} - {guest.phone} {guest.email && `- ${guest.email}`}
                        </Typography>
                      ))}
                    </CardContent>
                  </Card>
                ))}

                {/* Total Price */}
                <Paper sx={{ p: 3, mt: 3, backgroundColor: "#e8f5e9" }}>
                  <Typography variant="h5" fontWeight={700} color="#4caf50">
                    Total: {calculateTotal().toLocaleString()} ج.م
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {calculateNights()} nights × {selectedRooms.length} room types × Total {getTotalGuests()} guests
                  </Typography>
                </Paper>
              </Box>
            )}

            {/* Step 3: Success */}
            {activeStep === 3 && (
              <Box sx={{ mt: 4, textAlign: "center", py: 4 }}>
                <CheckCircleIcon sx={{ fontSize: 80, color: "#4caf50", mb: 2 }} />
                <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
                  Reservation Successful!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Your reservation has been confirmed for {selectedRooms.length} room(s) with {getTotalGuests()} guest(s).
                </Typography>
                
                <Paper sx={{ p: 3, maxWidth: 500, mx: "auto", textAlign: "left" }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Booking Details
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Place:</strong> {place.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Check-in:</strong> {formatDate(selectedRange.start)}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Check-out:</strong> {formatDate(selectedRange.end)}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Rooms:</strong> {selectedRooms.length} room type(s)
                  </Typography>
                  <Typography variant="body1">
                    <strong>Total Guests:</strong> {getTotalGuests()}
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
            {activeStep < 3 && (
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
                  onClick={activeStep === 2 ? handleReserve : handleNext}
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
                  ) : activeStep === 2 ? (
                    "Confirm Reservation"
                  ) : (
                    "Next"
                  )}
                </Button>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}