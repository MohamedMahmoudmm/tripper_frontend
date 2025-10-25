import React from "react";
import { TextField, Grid, Box, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

const ListingDetailsForm = () => {
  const { register } = useFormContext();

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>Listing Details</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField label="Title" fullWidth {...register("title")} required />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Description" fullWidth multiline rows={4} {...register("description")} required />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Type" fullWidth {...register("type")} required />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Guests" type="number" fullWidth {...register("guests")} required />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Bedrooms" type="number" fullWidth {...register("bedrooms")} required />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Bathrooms" type="number" fullWidth {...register("bathrooms")} required />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Price per night" type="number" fullWidth {...register("price")} required />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Location" fullWidth {...register("location")} required />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ListingDetailsForm;
