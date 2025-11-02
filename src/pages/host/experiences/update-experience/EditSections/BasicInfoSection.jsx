import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import experienceService from "../../../../../services/experince.service";
import { basicInfoUpdateSchema } from "../../validation/experienceSchema";

const BasicInfoSection = ({ experience, onUpdate }) => {
  const [form, setForm] = useState({
    name: experience.name || "",
    description: experience.description || "",
    price: experience.price || 0,
    country: experience.address?.country || "",
    city: experience.address?.city || "",
  });

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSave = async () => {
  try {
    
    const basicInfoData = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      country: form.country,
      city: form.city,
    };

  
    await basicInfoUpdateSchema.validate(basicInfoData, {
      abortEarly: false, 
    });

    setLoading(true);
    const updatedData = {
      ...basicInfoData,
      address: { country: form.country, city: form.city },
    };

    const res = await experienceService.updateExperience(
      experience._id,
      updatedData
    );

    onUpdate(res);
    setSnackbar({
      open: true,
      message: "Basic info updated successfully!",
      severity: "success",
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      
      setSnackbar({
        open: true,
        message: err.errors[0],
        severity: "warning",
      });
    } else {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to update basic info.",
        severity: "error",
      });
    }
  } finally {
    setLoading(false);
  }
};
  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Basic Information
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={form.name}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Price"
              name="price"
              type="number"
              fullWidth
              value={form.price}
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={3}
              value={form.description}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Country"
              name="country"
              fullWidth
              value={form.country}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="City"
              name="city"
              fullWidth
              value={form.city}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </CardContent>

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
    </Card>
  );
};

export default BasicInfoSection;
