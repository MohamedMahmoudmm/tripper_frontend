import React from "react";
import {
  Grid,
  TextField,
  Box,
  Typography,
  InputAdornment,
  alpha,
  Stack,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import {
  Description,
  AttachMoney,
  LocationOn,
  LocationCity,
  Event,
} from "@mui/icons-material";

const StepBasicInfo = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

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
          Basic Information
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Let's start with the essentials of your experience
        </Typography>
      </Box>

      <Stack spacing={3}>
        {/* Experience Name */}
        <TextField
          label="Experience Name"
          fullWidth
          placeholder="e.g., Desert Safari Adventure"
          {...register("name", {
            required: "Experience name is required",
            minLength: {
              value: 3,
              message: "Name must be at least 3 characters",
            },
          })}
          error={!!errors.name}
          helperText={errors.name?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Event sx={{ color: "#034959" }} />
              </InputAdornment>
            ),
          }}
          sx={inputStyle}
        />

        {/* Description */}
        <TextField
          label="Description"
          multiline
          rows={5}
          fullWidth
          placeholder="Describe your experience in detail. What makes it unique? What will guests do and see?"
          {...register("description", {
            required: "Description is required",
            minLength: {
              value: 10,
              message: "Description must be at least 10 characters",
            },
          })}
          error={!!errors.description}
          helperText={errors.description?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 2 }}>
                <Description sx={{ color: "#034959" }} />
              </InputAdornment>
            ),
          }}
          sx={inputStyle}
        />

        {/* Section Divider */}
        <Box display="flex" alignItems="center" my={1}>
          <Box flex={1} height="2px" bgcolor="#e0e0e0" />
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            color="#034959"
            px={2}
          >
            PRICING & LOCATION
          </Typography>
          <Box flex={1} height="2px" bgcolor="#e0e0e0" />
        </Box>

        {/* Price, Country, City in one row */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Price per Person"
              type="number"
              fullWidth
              placeholder="100"
              inputProps={{ min: 1 }}
              {...register("price", {
                required: "Price is required",
                min: { value: 1, message: "Price must be greater than 0" },
              })}
              error={!!errors.price}
              helperText={errors.price?.message || "In USD"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney sx={{ color: "#4CAF50" }} />
                  </InputAdornment>
                ),
              }}
              sx={inputStyle}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Country"
              fullWidth
              placeholder="e.g., Egypt"
              {...register("country", {
                required: "Country is required",
                minLength: {
                  value: 2,
                  message: "Country must be at least 2 characters",
                },
              })}
              error={!!errors.country}
              helperText={errors.country?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn sx={{ color: "#FF385C" }} />
                  </InputAdornment>
                ),
              }}
              sx={inputStyle}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="City"
              fullWidth
              placeholder="e.g., Cairo"
              {...register("city", {
                required: "City is required",
                minLength: {
                  value: 2,
                  message: "City must be at least 2 characters",
                },
              })}
              error={!!errors.city}
              helperText={errors.city?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationCity sx={{ color: "#034959" }} />
                  </InputAdornment>
                ),
              }}
              sx={inputStyle}
            />
          </Grid>
        </Grid>

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
            💡 Quick Tips
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                ✓ Use clear, engaging names
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                ✓ Write detailed descriptions
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                ✓ Research competitive pricing
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Box>
  );
};

export default StepBasicInfo;