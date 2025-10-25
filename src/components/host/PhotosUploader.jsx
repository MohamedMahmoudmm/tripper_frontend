import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { useFormContext } from "react-hook-form";

const PhotosUploader = () => {
  const { watch, setValue } = useFormContext();
  const photos = watch("photos") || [];

  const handleAddPhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgURL = URL.createObjectURL(file);
      setValue("photos", [...photos, imgURL]);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>Photos</Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" mb={1}>
        {photos.map((photo, i) => (
          <img key={i} src={photo} alt="listing" style={{ width: 100, height: 80, objectFit: "cover", borderRadius: 6 }} />
        ))}
      </Stack>
      <Button variant="outlined" component="label">Upload Photo
        <input type="file" hidden accept="image/*" onChange={handleAddPhoto} />
      </Button>
    </Box>
  );
};

export default PhotosUploader;
