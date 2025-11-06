import React from "react";
import { TextField, Grid } from "@mui/material";
import { useFormContext } from "react-hook-form";

const ListingDetailsForm = ({ type }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Grid container spacing={2}>
      {/* Title */}
      <Grid item xs={12}>
        <TextField
          label="Title"
          {...register("title", { required: "Title is required" })}
          fullWidth
          required
          error={!!errors.title}
          helperText={errors.title?.message}
        />
      </Grid>

      {/* Price */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Price"
          type="number"
          {...register("price", {
            required: "Price is required",
            valueAsNumber: true,
            min: { value: 0, message: "Price must be a positive number" },
          })}
          fullWidth
          required
          error={!!errors.price}
          helperText={errors.price?.message}
          inputProps={{ min: 0 }}
          onInput={(e) => {
            if (e.target.value < 0) e.target.value = 0;
          }}
        />
      </Grid>

      {/* Country */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Country"
          {...register("country", { required: "Country is required" })}
          fullWidth
          required
          error={!!errors.country}
          helperText={errors.country?.message}
        />
      </Grid>

      {/* City */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="City"
          {...register("city", { required: "City is required" })}
          fullWidth
          required
          error={!!errors.city}
          helperText={errors.city?.message}
        />
      </Grid>

      {/* Street */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Street"
          {...register("street", { required: "Street is required" })}
          fullWidth
          required
          error={!!errors.street}
          helperText={errors.street?.message}
        />
      </Grid>

      {/* Description */}
      <Grid item xs={12}>
        <TextField
          label="Description"
          {...register("description", {
            required: "Description is required",
            minLength: {
              value: 10,
              message: "Description must be at least 10 characters long",
            },
          })}
          multiline
          minRows={4}
          fullWidth
          required
          variant="outlined"
          sx={{
            "& .MuiInputBase-root": { padding: "10px" },
            "& textarea": {
              overflow: "hidden !important",
              resize: "none",
            },
          }}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
      </Grid>
    </Grid>
  );
};

export default ListingDetailsForm;
