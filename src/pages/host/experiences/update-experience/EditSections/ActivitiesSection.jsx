import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
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
import AddIcon from "@mui/icons-material/Add";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import ImageIcon from "@mui/icons-material/Image";
import { activitiesUpdateSchema } from "../../../validation/experienceSchema";
import experienceService from "../../../../../services/experince.service";
import toast from "react-hot-toast";

const ActivitiesSection = ({ experience, onUpdate }) => {
  const [activities, setActivities] = useState(experience.activities || []);
  const [newActivity, setNewActivity] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    activityId: null,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setNewActivity({ ...newActivity, image: file });
      setErrors({ ...errors, image: "" });
    }
  };

  const handleInputChange = (field, value) => {
    setNewActivity({ ...newActivity, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleAddActivity = async () => {
    try {
      setErrors({});
      await activitiesUpdateSchema.validate(newActivity, { abortEarly: false });

      const formData = new FormData();
      formData.append("title", newActivity.title);
      formData.append("description", newActivity.description);
      if (newActivity.image) {
        formData.append("image", newActivity.image);
      }

      setLoading(true);
      const res = await experienceService.addActivity(experience._id, formData);

      setActivities(res.activities);
      onUpdate(res);
      setNewActivity({ title: "", description: "", image: null });
      toast.success("Activity added successfully!");
    } catch (err) {
      if (err.name === "ValidationError") {
        const fieldErrors = {};
        err.inner.forEach((e) => {
          fieldErrors[e.path] = e.message;
        });
        setErrors(fieldErrors);
        
      } else {
        console.error(err);
        toast.error("Failed to add activity");
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteActivity = (activityId) => {
    setDeleteDialog({ open: true, activityId });
  };

  const handleDeleteActivity = async () => {
    const activityId = deleteDialog.activityId;
    try {
      setLoading(true);
      const res = await experienceService.removeActivity(
        experience._id,
        activityId
      );
      setActivities(res.activities);
      onUpdate(res);
      setDeleteDialog({ open: false, activityId: null });
      toast.success("Activity deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete activity");
      setDeleteDialog({ open: false, activityId: null });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setNewActivity({ ...newActivity, image: null });
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
              <LocalActivityIcon sx={{ color: "white", fontSize: 24 }} />
            </Box>
            <Typography variant="h5" fontWeight="700" color="#222">
              Activities
            </Typography>
          </Box>
          <Chip
            label={`${activities.length} activit${activities.length !== 1 ? "ies" : "y"}`}
            size="small"
            sx={{ bgcolor: "#f7f7f7", fontWeight: 600 }}
          />
        </Box>

        {/* Activities List */}
        <Grid container spacing={3} mb={4}>
          {activities.length > 0 ? (
            activities.map((activity) => (
              <Grid item xs={12} sm={6} md={4} key={activity._id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: "1px solid #e0e0e0",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  {activity.image && (
                    <Box
                      sx={{
                        height: 180,
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <img
                        src={activity.image}
                        alt={activity.title}
                        width="100%"
                        height="100%"
                        style={{ objectFit: "cover", display: "block" }}
                      />
                    </Box>
                  )}
                  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <Typography variant="h6" fontWeight="700" mb={1} color="#222">
                      {activity.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                      {activity.description || "No description available"}
                    </Typography>
                  </CardContent>
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    p={1.5}
                    borderTop="1px solid #f0f0f0"
                  >
                    <IconButton
                      color="error"
                      onClick={() => confirmDeleteActivity(activity._id)}
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
                </Card>
              </Grid>
            ))
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
                <LocalActivityIcon
                  sx={{ fontSize: 64, color: "#ccc", mb: 2 }}
                />
                <Typography color="text.secondary" variant="body1">
                  No activities added yet
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Add New Activity Form */}
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
              Add New Activity
            </Typography>
          </Box>

          <Grid container spacing={2.5}>
            {/* Title */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Activity Title"
                fullWidth
                value={newActivity.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                error={!!errors.title}
                helperText={errors.title || "What is this activity called?"}
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

            {/* Description */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Description"
                fullWidth
                value={newActivity.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                error={!!errors.description}
                helperText={errors.description || "Brief description"}
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

            {/* Image Upload */}
            <Grid item xs={12} md={6}>
              <Box>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<ImageIcon />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    borderColor: errors.image ? "#d32f2f" : "#FF385C",
                    color: errors.image ? "#d32f2f" : "#FF385C",
                    textTransform: "none",
                    fontWeight: 600,
                    bgcolor: "white",
                    "&:hover": {
                      borderColor: errors.image ? "#d32f2f" : "#E31C5F",
                      bgcolor: errors.image
                        ? "rgba(211, 47, 47, 0.04)"
                        : "rgba(255,56,92,0.04)",
                    },
                  }}
                >
                  {newActivity.image ? "Change Image" : "Upload Image"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                {errors.image && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, ml: 1.5, display: "block" }}
                  >
                    {errors.image}
                  </Typography>
                )}
              </Box>

              {/* Image Preview */}
              {newActivity.image && (
                <Box
                  sx={{
                    mt: 2,
                    position: "relative",
                    width: "100%",
                    height: 120,
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "2px solid #FF385C",
                  }}
                >
                  <img
                    src={URL.createObjectURL(newActivity.image)}
                    alt="Preview"
                    width="100%"
                    height="100%"
                    style={{ objectFit: "cover", display: "block" }}
                  />
                  <IconButton
                    size="small"
                    onClick={handleRemoveImage}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      bgcolor: "rgba(255,255,255,0.95)",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,1)",
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  <Chip
                    label="Preview"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      bgcolor: "#FF385C",
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                </Box>
              )}
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} md={6} display="flex" alignItems="center">
              <Button
                variant="contained"
                onClick={handleAddActivity}
                disabled={loading}
                fullWidth
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <AddIcon />
                  )
                }
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: "#FF385C",
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
                {loading ? "Adding..." : "Add Activity"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, activityId: null })}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          Confirm Activity Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this activity? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, activityId: null })}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "#666",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteActivity}
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

export default ActivitiesSection;