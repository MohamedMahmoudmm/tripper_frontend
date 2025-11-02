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
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { activitiesUpdateSchema } from "../../validation/experienceSchema";
import experienceService from "../../../../../services/experince.service"; 

const ActivitiesSection = ({ experience, onUpdate }) => {
  const [activities, setActivities] = useState(experience.activities || []);
  const [newActivity, setNewActivity] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    activityId: null,
  });

  const handleImageChange = (e) => {
    setNewActivity({ ...newActivity, image: e.target.files[0] });
  };

const handleAddActivity = async () => {
  try {
    await activitiesUpdateSchema.validate(newActivity, { abortEarly: false });

    const formData = new FormData();
    formData.append("title", newActivity.title);
    formData.append("description", newActivity.description);
    formData.append("image", newActivity.image);

    setLoading(true);
    const res = await experienceService.addActivity(experience._id, formData);

    setActivities(res.activities);
    onUpdate(res);
    setNewActivity({ title: "", description: "", image: null });
    setSnackbar({
      open: true,
      message: "Activity added successfully!",
      severity: "success",
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = err.errors.join(", ");
      setSnackbar({
        open: true,
        message: messages,
        severity: "warning",
      });
    } else {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to add activity",
        severity: "error",
      });
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
      const res = await experienceService.removeActivity(experience._id, activityId);
      setActivities(res.activities);
      onUpdate(res);
      setSnackbar({
        open: true,
        message: "Activity deleted successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to delete activity",
        severity: "error",
      });
    } finally {
      setLoading(false);
      setDeleteDialog({ open: false, activityId: null });
    }
  };

  return (
    <Card elevation={4} sx={{ p: 2, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Activities
        </Typography>

        <Grid container spacing={2} mb={3}>
          {activities.length > 0 ? (
            activities.map((activity) => (
              <Grid item xs={12} sm={6} md={4} key={activity._id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <CardContent>
                    {activity.image && (
                      <Box
                        sx={{
                          height: 160,
                          overflow: "hidden",
                          borderRadius: 2,
                          mb: 2,
                        }}
                      >
                        <img
                          src={activity.image}
                          alt={activity.title}
                          width="100%"
                          height="100%"
                          style={{ objectFit: "cover" }}
                        />
                      </Box>
                    )}
                    <Typography variant="h6" fontWeight="bold">
                      {activity.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      {activity.description || "No description available."}
                    </Typography>
                  </CardContent>
                  <Box display="flex" justifyContent="flex-end" p={1}>
                    <IconButton
                      color="error"
                      onClick={() => confirmDeleteActivity(activity._id)}
                      disabled={loading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography color="text.secondary" textAlign="center" mt={2}>
                No activities added yet.
              </Typography>
            </Grid>
          )}
        </Grid>

        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: "#f9f9f9",
            mt: 4,
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Add New Activity
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Title"
                fullWidth
                value={newActivity.title}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, title: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Description"
                fullWidth
                value={newActivity.description}
                onChange={(e) =>
                  setNewActivity({
                    ...newActivity,
                    description: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" gap={2}>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ flexShrink: 0 }}
                >
                  Upload Image
                  <input type="file" hidden onChange={handleImageChange} />
                </Button>

                {newActivity.image && (
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid #ddd",
                    }}
                  >
                    <img
                      src={URL.createObjectURL(newActivity.image)}
                      alt="Preview"
                      width="100%"
                      height="100%"
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={6} display="flex" alignItems="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddActivity}
                disabled={loading}
                fullWidth
                sx={{ py: 1.3 }}
              >
                {loading ? "Adding..." : "Add Activity"}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </CardContent>

      {/*  Confirm Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, activityId: null })}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this activity? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, activityId: null })}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleDeleteActivity} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ActivitiesSection;
