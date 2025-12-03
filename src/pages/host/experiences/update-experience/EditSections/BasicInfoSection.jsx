import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-hot-toast";
import SaveIcon from "@mui/icons-material/Save";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import experienceService from "../../../../../services/experince.service";
import { basicInfoUpdateSchema } from "../../../validation/experienceSchema";

const BasicInfoSection = ({ experience, onUpdate }) => {
  const [form, setForm] = useState({
    name: experience.name || "",
    description: experience.description || "",
    price: experience.price || 0,
    country: experience.address?.country || "",
    city: experience.address?.city || "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent negative price
    if (name === "price" && Number(value) < 0) {
      return;
    }

    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      setErrors({});
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
      setIsDirty(false);
      toast.success("Basic info updated successfully!");
    } catch (err) {
      if (err.name === "ValidationError") {
        const fieldErrors = {};
        err.inner.forEach((e) => {
          fieldErrors[e.path] = e.message;
        });
        setErrors(fieldErrors);
        toast.error("Please fix the errors before saving");
      } else {
        console.error(err);
        toast.error("Failed to update basic info");
      }
    } finally {
      setLoading(false);
    }
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
        <Box display="flex" alignItems="center" mb={3}>
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
            <InfoOutlinedIcon sx={{ color: "white", fontSize: 24 }} />
          </Box>
          <Typography variant="h5" fontWeight="700" color="#222">
            Basic Information
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Name Field */}
          <Grid item xs={12} md={8}>
            <TextField
              label="Experience Name"
              name="name"
              fullWidth
              value={form.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name || "Give your experience a clear, descriptive name"}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": { borderColor: "#FF385C" },
                  "&.Mui-focused fieldset": { borderColor: "#FF385C" },
                },
              }}
            />
          </Grid>

          {/* Price Field */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Price (USD)"
              name="price"
              type="number"
              fullWidth
              value={form.price}
              onChange={handleChange}
              inputProps={{ min: 0, step: 1 }}
              error={!!errors.price}
              helperText={errors.price || "Per person"}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": { borderColor: "#FF385C" },
                  "&.Mui-focused fieldset": { borderColor: "#FF385C" },
                },
              }}
            />
          </Grid>

          {/* Description Field */}
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={4}
              value={form.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={
                errors.description ||
                `${form.description.length} characters - Describe what makes your experience unique`
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": { borderColor: "#FF385C" },
                  "&.Mui-focused fieldset": { borderColor: "#FF385C" },
                },
              }}
            />
          </Grid>

          {/* Country Field */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Country"
              name="country"
              fullWidth
              value={form.country}
              onChange={handleChange}
              error={!!errors.country}
              helperText={errors.country}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": { borderColor: "#FF385C" },
                  "&.Mui-focused fieldset": { borderColor: "#FF385C" },
                },
              }}
            />
          </Grid>

          {/* City Field */}
          <Grid item xs={12} md={6}>
            <TextField
              label="City"
              name="city"
              fullWidth
              value={form.city}
              onChange={handleChange}
              error={!!errors.city}
              helperText={errors.city}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": { borderColor: "#FF385C" },
                  "&.Mui-focused fieldset": { borderColor: "#FF385C" },
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Save Button */}
        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading || !isDirty}
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
            sx={{
              bgcolor: "#FF385C",
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 600,
              "&:hover": { bgcolor: "#E31C5F" },
              "&:disabled": {
                bgcolor: "#ccc",
                color: "#666",
              },
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BasicInfoSection;