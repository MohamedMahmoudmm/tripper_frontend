import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Divider,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import ListingDetailsForm from "../../../components/host/hotel/ListingDetailsForm";
import AmenitiesForm from "../../../components/host/hotel/AmenitiesForm";
import PhotosUploader from "../../../components/host/hotel/PhotosUploader";
import SubmitSection from "../../../components/host/hotel/SubmitSection";
import HostLayout from "../../../components/host/HostLayout";
import hotelService from "../../../services/hotels.service"; 

const EditHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const methods = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      country: "",
      city: "",
      street: "",
      amenities: [],
      photos: [],
      oldPhotos: [],
    },
  });

  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const hotel = await hotelService.getHotelById(id);

        let normalizedAmenities = [];
        (hotel.amenities || []).forEach((a) => {
          if (typeof a === "string") {
            try {
              const parsed = JSON.parse(a);
              if (Array.isArray(parsed))
                normalizedAmenities.push(...parsed.map((x) => x.toLowerCase()));
              else normalizedAmenities.push(a.trim().toLowerCase());
            } catch {
              normalizedAmenities.push(a.trim().toLowerCase());
            }
          }
        });

        methods.reset({
          title: hotel.name,
          description: hotel.description || "",
          price: hotel.price || "",
          country: hotel.address?.country || "",
          city: hotel.address?.city || "",
          street: hotel.address?.street || "",
          amenities: normalizedAmenities,
          oldPhotos: hotel.images || [],
          photos: [],
        });
      } catch (err) {
        console.error("Fetch hotel error:", err);
        setSnackbar({
          open: true,
          message: "Failed to load hotel data",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id, methods]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.title,
        description: data.description,
        price: Number(data.price),
        address: {
          country: data.country,
          city: data.city,
          street: data.street,
        },
        amenities: data.amenities,
      };

      await hotelService.updateHotel(id, payload); 

      setSnackbar({
        open: true,
        message: "Hotel updated successfully!",
        severity: "success",
      });

      setTimeout(() => navigate("/host/listings"), 1000);
    } catch (err) {
      console.error("Update hotel error:", err.response?.data || err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to update hotel",
        severity: "error",
      });
    }
  };

  if (loading)
    return (
      <HostLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
          <CircularProgress />
        </Box>
      </HostLayout>
    );

  return (
    <HostLayout>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            textAlign="center"
            color="primary"
          >
            ✏️ Edit Hotel
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
                <SubmitSection onSubmit={methods.handleSubmit(onSubmit)} />
              </Box>
            </Box>
          </FormProvider>
        </Paper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </HostLayout>
  );
};

export default EditHotel;
