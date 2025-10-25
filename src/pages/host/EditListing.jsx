import React, { useState } from "react";
import { Container, Typography, Box, TextField, Button, MenuItem, Stack } from "@mui/material";
import { Save } from "@mui/icons-material";
import { useForm, FormProvider } from "react-hook-form";
import { useLocation } from "react-router-dom";

const EditListing = () => {
  const location = useLocation();
  const listing = location.state?.listing || {};
  const methods = useForm({ defaultValues: listing });

  const [image, setImage] = useState(listing.image || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const onSubmit = (data) => {
    console.log("Updated Listing:", { ...data, image });
 
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
        Edit Listing
      </Typography>

      <FormProvider {...methods}>
        <Box component="form" onSubmit={methods.handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 3, p: 3, bgcolor: "#fff", borderRadius: 3, boxShadow: 3 }}>
          
          {/* image listing  */}
          <Stack spacing={2} alignItems="center">
            {image && <img src={image} alt="listing" style={{ width: "100%", maxHeight: 250, objectFit: "cover", borderRadius: 12 }} />}
            <Button variant="outlined" component="label">
              Change Photo
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
          </Stack>

         
          <TextField label="Title" {...methods.register("title")} fullWidth required />
          <TextField label="Price per night" type="number" {...methods.register("price")} fullWidth required />
          <TextField select label="Type" {...methods.register("type")} fullWidth>
            <MenuItem value="Apartment">Apartment</MenuItem>
            <MenuItem value="Villa">Villa</MenuItem>
            <MenuItem value="Studio">Studio</MenuItem>
          </TextField>

          <Button variant="contained" startIcon={<Save />} type="submit" sx={{ bgcolor: "#FF385C", "&:hover": { bgcolor: "#e22d50" }, py: 1.5, fontWeight: "bold" }}>
            Save Changes
          </Button>
        </Box>
      </FormProvider>
    </Container>
  );
};

export default EditListing;
