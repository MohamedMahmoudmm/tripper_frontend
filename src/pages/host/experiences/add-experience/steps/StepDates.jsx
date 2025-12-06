import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  alpha,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Add,
  Delete,
  CalendarMonth,
  EventAvailable,
} from "@mui/icons-material";
import experienceService from "../../../../../services/experince.service";
import { toast } from "react-hot-toast";

const StepDates = ({ experienceId }) => {
  const [dates, setDates] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState("");
  
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    dateToDelete: null,
  });

  useEffect(() => {
    const fetchDates = async () => {
      if (!experienceId) return;
      try {
        const experience = await experienceService.getExperienceById(experienceId);
        setDates(experience.dates || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dates");
      }
    };
    fetchDates();
  }, [experienceId]);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const validateDate = (date) => {
    if (!date) {
      setDateError("Please select a date");
      return false;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setDateError("Date cannot be in the past");
      return false;
    }

    if (dates.some(d => new Date(d).toDateString() === selectedDate.toDateString())) {
      setDateError("This date is already added");
      return false;
    }

    setDateError("");
    return true;
  };

  const handleAddDate = async () => {
    if (!validateDate(newDate) || !experienceId) return;

    setLoading(true);
    try {
      const res = await experienceService.addDate(experienceId, newDate);
      setDates(res.dates || []);
      setNewDate("");
      setDateError("");
      toast.success("Date added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error adding date");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteDate = (date) => {
    setConfirmDialog({ open: true, dateToDelete: date });
  };

  const handleConfirmDelete = async () => {
    const date = confirmDialog.dateToDelete;
    if (!date) return;

    setLoading(true);
    try {
      const res = await experienceService.removeDate(experienceId, date);
      setDates(res.dates || []);
      toast.success("Date removed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error removing date");
    } finally {
      setLoading(false);
      setConfirmDialog({ open: false, dateToDelete: null });
    }
  };

  // Check if date is in the past
  const isPastDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Format date - same as DatesSection
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

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      backgroundColor: alpha("#034959", 0.02),
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: alpha("#034959", 0.04),
      },
      "&.Mui-focused": {
        backgroundColor: "#fff",
        "& fieldset": {
          borderColor: "#034959",
          borderWidth: 2,
        },
      },
    },
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={4} textAlign="center">
        <Typography variant="h4" fontWeight="bold" color="#034959" gutterBottom>
          Available Dates
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Select dates when your experience will be available
        </Typography>
      </Box>

      {/* Add Date Section */}
      <Box
        sx={{
          p: 3,
          mb: 4,
          backgroundColor: alpha("#034959", 0.02),
          borderRadius: 3,
          border: `2px solid ${alpha("#034959", 0.1)}`,
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="#034959" mb={3}>
          Add New Date
        </Typography>

        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} sm={8}>
            <TextField
              label="Select Date"
              type="date"
              fullWidth
              value={newDate}
              onChange={(e) => {
                setNewDate(e.target.value);
                setDateError("");
              }}
              error={!!dateError}
              helperText={dateError || "Select a future date for your experience"}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: getTodayDate(),
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonth sx={{ color: "#034959" }} />
                  </InputAdornment>
                ),
              }}
              sx={inputStyle}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : <Add />}
              onClick={handleAddDate}
              disabled={loading || !newDate}
              sx={{
                py: 1.8,
                bgcolor: "#034959",
                "&:hover": { bgcolor: "#023342" },
                fontWeight: "bold",
                borderRadius: 3,
                "&:disabled": {
                  bgcolor: alpha("#034959", 0.3),
                },
              }}
            >
              {loading ? "Adding..." : "Add Date"}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Dates List */}
      <Box mb={3}>
        <Box display="flex" alignItems="center" mb={3}>
          <Box flex={1} height="2px" bgcolor="#e0e0e0" />
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            color="#034959"
            px={2}
          >
            SELECTED DATES ({dates.length})
          </Typography>
          <Box flex={1} height="2px" bgcolor="#e0e0e0" />
        </Box>
        {dates.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              px: 3,
              backgroundColor: alpha("#e0e0e0", 0.2),
              borderRadius: 3,
            }}
          >
            <EventAvailable sx={{ fontSize: 80, color: "#bdbdbd", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No dates selected yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add dates when your experience will be available
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {dates.map((date, index) => {
              const isPast = isPastDate(date);
              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2.5,
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.3s ease",
                      border: isPast ? "2px solid #ffcdd2" : `2px solid ${alpha("#034959", 0.1)}`,
                      bgcolor: isPast ? "#fff5f5" : "white",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        borderColor: isPast ? "#ffcdd2" : alpha("#034959", 0.3),
                        boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <EventAvailable 
                        sx={{ 
                          color: isPast ? "#d32f2f" : "#034959",
                          fontSize: 28 
                        }} 
                      />
                      <Box>
                        <Typography 
                          variant="h6" 
                          fontWeight="bold" 
                          color={isPast ? "#d32f2f" : "#034959"}
                          sx={{
                            textDecoration: isPast ? "line-through" : "none"
                          }}
                        >
                          {formatDate(date)}
                        </Typography>
                        {isPast && (
                          <Typography variant="caption" color="error">
                            Past date
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => confirmDeleteDate(date)}
                      disabled={loading}
                      sx={{
                        "&:hover": {
                          bgcolor: "rgba(211, 47, 47, 0.08)",
                        },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>

      {/* Tips */}
      <Box
        sx={{
          p: 2.5,
          backgroundColor: alpha("#034959", 0.05),
          borderRadius: 2,
          borderLeft: "4px solid #034959",
        }}
      >
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          color="#034959"
          gutterBottom
        >
          📅 Date Tips
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              ✓ Add multiple date options
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              ✓ Only future dates allowed
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              ✓ You can add more dates later
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, dateToDelete: null })}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", color:"#034959" }}>
          Confirm Date Deletion
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove the date{" "}
            <strong>
              {confirmDialog.dateToDelete && formatDate(confirmDialog.dateToDelete)}
            </strong>
            ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setConfirmDialog({ open: false, dateToDelete: null })}
            sx={{
              color: "#757575",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              bgcolor: "#d32f2f",
              "&:hover": { bgcolor: "#b71c1c" },
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StepDates;