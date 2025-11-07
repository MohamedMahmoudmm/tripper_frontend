import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Divider,
  Box,
  Button,
} from "@mui/material";
import { ArrowBackIosNew } from "@mui/icons-material";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import ListingDetailsForm from "../../../components/host/hotel/ListingDetailsForm";
import AmenitiesForm from "../../../components/host/hotel/AmenitiesForm";
import PhotosUploader from "../../../components/host/hotel/PhotosUploader";
import SubmitSection from "../../../components/host/hotel/SubmitSection";
import HostLayout from "../../../components/host/HostLayout";
import hotelService from "../../../services/hotels.service";
import { addHotelSchema } from "../validation/hotelSchema";

const AddHotel = () => {
  const methods = useForm({
    resolver: yupResolver(addHotelSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      country: "",
      city: "",
      street: "",
      amenities: [],
      starRating: 0,
      photos: [],
    },
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("name", data.title);
      formData.append("description", data.description);
      formData.append("price", Number(data.price));

      formData.append("address[country]", data.country || "Egypt");
      formData.append("address[city]", data.city || "Cairo");
      formData.append("address[street]", data.street || "Any Street");

      data.amenities.forEach(item => {
        formData.append("amenities[]", item);
      });
      data.photos.forEach((file) => formData.append("images", file));

      await hotelService.addHotel(formData);

      toast.success("Hotel added successfully! ");

      methods.reset();
      setTimeout(() => navigate("/host/listings"), 1200);
    } catch (err) {
      console.error("Add hotel error:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to add hotel ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <HostLayout>
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 4,
            position: "relative",
          }}
        >
          <Button
            startIcon={<ArrowBackIosNew />}
            onClick={() => navigate(-1)}
            sx={{
              position: "absolute",
              top: 20,
              left: 20,
              color: "#f27244",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                color: "#034959",
              },
            }}
          >
            Back
          </Button>

          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            textAlign="center"
            color="#034959"
          >
            🏨 Add Hotel
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <FormProvider {...methods}>
            <Box component="form" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
              <Paper sx={{ p: 3, mb: 3 }}>
                <ListingDetailsForm type="hotel" />
              </Paper>

              <Paper sx={{ p: 3, mb: 3 }}>
                <AmenitiesForm />
              </Paper>

              <Paper sx={{ p: 3, mb: 3 }}>
                <PhotosUploader />
              </Paper>

              <Box textAlign="center">
                <SubmitSection onSubmit={methods.handleSubmit(onSubmit)} loading={loading} />
              </Box>
            </Box>
          </FormProvider>
        </Paper>
      </Container>
    </HostLayout>
  );
};

export default AddHotel;
