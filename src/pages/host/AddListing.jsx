import React from "react";
import {
  Container,
  Paper,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import ListingDetailsForm from "../../components/host/ListingDetailsForm";
import AmenitiesForm from "../../components/host/AmenitiesForm";
import PhotosUploader from "../../components/host/PhotosUploader";
import SubmitSection from "../../components/host/SubmitSection";

const AddListing = () => {
  const methods = useForm({
    defaultValues: {
      title: "",
      description: "",
      type: "",
      guests: "",
      bedrooms: "",
      bathrooms: "",
      price: "",
      location: "",
      amenities: [],
      photos: [],
    },
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          textAlign="center"
          color="primary"
        >
          Add Your Place
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <FormProvider {...methods}>
          <Box
            component="form"
            onSubmit={methods.handleSubmit(onSubmit)}
            noValidate
          >
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}></Typography>
              <ListingDetailsForm />
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}></Typography>
              <AmenitiesForm />
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}></Typography>
              <PhotosUploader />
            </Paper>

            <Box textAlign="center">
              <SubmitSection />
            </Box>
          </Box>
        </FormProvider>
      </Paper>
    </Container>
  );
};

export default AddListing;
