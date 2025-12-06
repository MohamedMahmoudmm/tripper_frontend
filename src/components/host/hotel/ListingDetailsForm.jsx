import React from "react";
import { TextField, Grid, Typography, Box, InputAdornment, Stack } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import TitleIcon from "@mui/icons-material/Title";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PublicIcon from "@mui/icons-material/Public";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import NoteAltIcon from "@mui/icons-material/NoteAlt";

const ListingDetailsForm = () => {
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useFormContext();

  const type = watch("type");
  const rooms = watch("rooms") || [];

  const getTypeLabel = () => {
    if (type === "hotel") return "Hotel";
    if (type === "villa") return "Villa";
    if (type === "apartment") return "Apartment";
    return "Property";
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <Box sx={{ width: 4, height: 24, backgroundColor: "#667eea", borderRadius: 1 }} />
        <Box>
          <Typography variant="h6" fontWeight="bold" color="#222">
            {getTypeLabel()} Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Provide essential information about your property
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={3}>
        {/* Title */}
        <Grid item xs={12}>
          <TextField
            label={`${getTypeLabel()} Name`}
            placeholder="e.g., Luxury Beachfront Villa with Ocean View"
            {...register("title")}
            fullWidth
            error={!!errors.title}
            helperText={errors.title?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TitleIcon sx={{ color: "#667eea" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&.Mui-focused fieldset": {
                  borderColor: "#667eea",
                  borderWidth: 2,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#667eea",
              },
            }}
          />
        </Grid>

        {/* Price - Only for Villa/Apartment */}
        {type !== "hotel" && rooms.length === 0 && (
          <Grid item xs={12} sm={6}>
            <Controller
              name="price"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Price per Night"
                  type="number"
                  placeholder="Enter price in USD"
                  fullWidth
                  error={!!errors.price}
                  helperText={errors.price?.message || "Set your nightly rate"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyIcon sx={{ color: "#66BB6A" }} />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) =>
                    field.onChange(e.target.value === "" ? null : Number(e.target.value))
                  }
                  value={field.value ?? ""}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&.Mui-focused fieldset": {
                        borderColor: "#66BB6A",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#66BB6A",
                    },
                  }}
                />
              )}
            />
          </Grid>
        )}

        {/* Country */}
        <Grid item xs={12} sm={type !== "hotel" && rooms.length === 0 ? 6 : 4}>
          <TextField
            label="Country"
            placeholder="e.g., Egypt"
            {...register("country")}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PublicIcon sx={{ color: "#667eea" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&.Mui-focused fieldset": {
                  borderColor: "#667eea",
                  borderWidth: 2,
                },
              },
            }}
          />
        </Grid>

        {/* City */}
        <Grid item xs={12} sm={type !== "hotel" && rooms.length === 0 ? 6 : 4}>
          <TextField
            label="City"
            placeholder="e.g., Cairo"
            {...register("city")}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationCityIcon sx={{ color: "#667eea" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&.Mui-focused fieldset": {
                  borderColor: "#667eea",
                  borderWidth: 2,
                },
              },
            }}
          />
        </Grid>

        {/* Street */}
        <Grid item xs={12} sm={type !== "hotel" && rooms.length === 0 ? 12 : 4}>
          <TextField
            label="Street Address"
            placeholder="e.g., 123 Main Street"
            {...register("street")}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HomeIcon sx={{ color: "#667eea" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&.Mui-focused fieldset": {
                  borderColor: "#667eea",
                  borderWidth: 2,
                },
              },
            }}
          />
        </Grid>

         {/* Notes */}
        <Grid item xs={12}>
          <TextField
            label="Notes"
            placeholder="Additional notes for guests"
            {...register("notes")}
            multiline
            minRows={5}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 2 }}>
                  <NoteAltIcon sx={{ color: "#667eea" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&.Mui-focused fieldset": {
                  borderColor: "#667eea",
                  borderWidth: 2,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#667eea",
              },
            }}
          />
        </Grid>

        {/* Description */}
        <Grid item xs={12}>
          <TextField
            label="Description"
            placeholder="Describe your property in detail. What makes it special? What can guests expect?"
            {...register("description")}
            multiline
            minRows={5}
            fullWidth
            error={!!errors.description}
            helperText={
              errors.description?.message ||
              "Write a compelling description (min. 50 characters)"
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 2 }}>
                  <DescriptionIcon sx={{ color: "#667eea" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&.Mui-focused fieldset": {
                  borderColor: "#667eea",
                  borderWidth: 2,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#667eea",
              },
            }}
          />
        </Grid>

       
      </Grid>
    </Box>
  );
};

export default ListingDetailsForm;