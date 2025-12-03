import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AddIcon from "@mui/icons-material/Add";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import experienceService from "../../../../../services/experince.service";
import toast from "react-hot-toast";

const DatesSection = ({ experience, onUpdate }) => {
  const [dates, setDates] = useState(experience.dates || []);
  const [newDate, setNewDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    index: null,
  });

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleAddDate = async () => {
    if (!newDate) {
      return toast.error("Please select a date");
    }

    // Check if date is in the past
    const selectedDate = new Date(newDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return toast.error("Cannot add past dates. Please select a future date");
    }

    // Check if date already exists
    if (dates.includes(newDate)) {
      return toast.error("This date already exists");
    }

    try {
      setLoading(true);
      const updatedDates = [...dates, newDate].sort();

      const res = await experienceService.updateExperience(experience._id, {
        dates: updatedDates,
      });

      setDates(res.dates);
      setNewDate("");
      onUpdate(res);

      toast.success("Date added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add date");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteDate = (index) => {
    setDeleteDialog({ open: true, index });
  };

  const handleDeleteDate = async () => {
    const index = deleteDialog.index;
    try {
      setLoading(true);
      const updatedDates = dates.filter((_, i) => i !== index);

      const res = await experienceService.updateExperience(experience._id, {
        dates: updatedDates,
      });

      setDates(res.dates);
      onUpdate(res);
      setDeleteDialog({ open: false, index: null });

      toast.success("Date removed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete date");
      setDeleteDialog({ open: false, index: null });
    } finally {
      setLoading(false);
    }
  };

  // Check if date is in the past
  const isPastDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 3,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        },
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                bgcolor: "#FF385C",
                p: 1,
                borderRadius: 2,
                mr: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <CalendarTodayIcon sx={{ color: "white", fontSize: 24 }} />
            </Box>
            <Typography variant="h5" fontWeight="700" color="#222">
              Available Dates
            </Typography>
          </Box>
          <Chip
            label={`${dates.length} date${dates.length !== 1 ? "s" : ""}`}
            size="small"
            sx={{ bgcolor: "#f7f7f7", fontWeight: 600 }}
          />
        </Box>

        {/* Current Dates */}
        <Grid container spacing={2} mb={4}>
          {dates.length > 0 ? (
            dates.map((date, index) => {
              const isPast = isPastDate(date);
              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      p: 2,
                      border: isPast ? "1px solid #ffcdd2" : "1px solid #e0e0e0",
                      borderRadius: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      bgcolor: isPast ? "#fff5f5" : "white",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Box>
                      <Typography fontWeight="700" color={isPast ? "#d32f2f" : "#222"}>
                        {formatDate(date)}
                      </Typography>
                      {isPast && (
                        <Typography variant="caption" color="error">
                          Past date
                        </Typography>
                      )}
                    </Box>
                    <IconButton
                      color="error"
                      onClick={() => confirmDeleteDate(index)}
                      disabled={loading}
                      size="small"
                      sx={{
                        "&:hover": {
                          bgcolor: "rgba(211, 47, 47, 0.08)",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
              );
            })
          ) : (
            <Grid item xs={12}>
              <Box
                sx={{
                  textAlign: "center",
                  py: 6,
                  border: "2px dashed #e0e0e0",
                  borderRadius: 3,
                  bgcolor: "#fafafa",
                }}
              >
                <EventAvailableIcon
                  sx={{ fontSize: 64, color: "#ccc", mb: 2 }}
                />
                <Typography color="text.secondary" variant="body1">
                  No dates available yet
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Add New Date */}
        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: "#f8f9fa",
          }}
        >
          <Box display="flex" alignItems="center" mb={3}>
            <AddIcon sx={{ color: "#FF385C", mr: 1 }} />
            <Typography variant="h6" fontWeight="600" color="#222">
              Add New Date
            </Typography>
          </Box>

          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Select Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                inputProps={{
                  min: getTodayDate(),
                }}
                helperText="Select a future date for your experience"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "white",
                    "&:hover fieldset": { borderColor: "#FF385C" },
                    "&.Mui-focused fieldset": { borderColor: "#FF385C" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleAddDate}
                disabled={loading || !newDate}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <AddIcon />
                  )
                }
                sx={{
                  height: "100%",
                  minHeight: "56px",
                  bgcolor: "#FF385C",
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "16px",
                  "&:hover": { bgcolor: "#E31C5F" },
                  "&:disabled": {
                    bgcolor: "#ccc",
                    color: "#666",
                  },
                }}
              >
                {loading ? "Adding..." : "Add Date"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, index: null })}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          Confirm Date Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this date? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, index: null })}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "#666",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteDate}
            variant="contained"
            color="error"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default DatesSection;