import React, { useEffect, useState } from "react";
import { FormGroup, FormControlLabel, Checkbox, Typography, Box, CircularProgress } from "@mui/material";
import { useFormContext } from "react-hook-form";

const AmenitiesForm = () => {
  const { watch, setValue } = useFormContext();
  const selectedAmenities = watch("amenities") || [];
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultAmenities = [
    "Free Wi-Fi",
    "Air Conditioning",
    "Swimming Pool",
    "Parking",
    "TV",
    "Kitchen",
    "Washer",
    "Pet Friendly",
    "Breakfast Included",
    "24/7 Support",
  ];

  useEffect(() => {
    setAmenities(defaultAmenities.map(a => a.toLowerCase()));  
    setLoading(false);
  }, []);

  const handleChange = (amenity) => {
    const updated = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity];
    setValue("amenities", updated, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Amenities
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" py={3}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <FormGroup sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 1 }}>
          {amenities.map((amenity) => (
            <FormControlLabel
              key={amenity}
              control={
                <Checkbox
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() => handleChange(amenity)}
                />
              }
              label={amenity.charAt(0).toUpperCase() + amenity.slice(1)}  
            />
          ))}
        </FormGroup>
      )}
    </Box>
  );
};

export default AmenitiesForm;
