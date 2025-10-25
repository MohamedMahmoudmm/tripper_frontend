import React from "react";
import { Box, Typography, Grid, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useFormContext } from "react-hook-form";

const amenitiesList = ["Wi-Fi", "Air Conditioning", "Kitchen", "Parking", "Pool", "TV", "Washer", "Heating", "Balcony", "Pet Friendly"];

const AmenitiesForm = () => {
  const { watch, setValue } = useFormContext();
  const selectedAmenities = watch("amenities") || [];

  const handleToggle = (amenity) => {
    const updated = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity];
    setValue("amenities", updated);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>Amenities</Typography>
      <FormGroup>
        <Grid container spacing={1}>
          {amenitiesList.map(a => (
            <Grid item xs={6} sm={4} key={a}>
              <FormControlLabel
                control={<Checkbox checked={selectedAmenities.includes(a)} onChange={() => handleToggle(a)} />}
                label={a}
              />
            </Grid>
          ))}
        </Grid>
      </FormGroup>
    </Box>
  );
};

export default AmenitiesForm;
