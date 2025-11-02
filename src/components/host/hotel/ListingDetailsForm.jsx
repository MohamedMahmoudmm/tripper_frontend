import React from "react";
import { TextField, Grid } from "@mui/material";
import { useFormContext } from "react-hook-form";

const ListingDetailsForm = ({ type }) => {
  const { register } = useFormContext();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField label="Title" {...register("title")} fullWidth required />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label="Price"
          type="number"
          {...register("price")}
          fullWidth
          required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label="Country"
          {...register("country")}
          fullWidth
          required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField label="City" {...register("city")} fullWidth required />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField label="Street" {...register("street")} fullWidth required />
      </Grid>

      <Grid item xs={12}>
        <TextField
          label="Description"
          {...register("description")}
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
        />
      </Grid>
    </Grid>
  );
};

export default ListingDetailsForm;
