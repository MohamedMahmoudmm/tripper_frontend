import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Divider,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import { ArrowBackIosNew } from "@mui/icons-material";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";

import toast from "react-hot-toast";
import { editHotelSchema } from "../validation/hotelSchema";

import ListingDetailsForm from "../../../components/host/hotel/ListingDetailsForm";
import AmenitiesForm from "../../../components/host/hotel/AmenitiesForm";
import PhotosUploader from "../../../components/host/hotel/PhotosUploader";
import SubmitSection from "../../../components/host/hotel/SubmitSection";
import HostLayout from "../../../components/host/HostLayout";
import hotelService from "../../../services/hotels.service";

const EditHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const methods = useForm({
    resolver: yupResolver(editHotelSchema),
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
      } catch {
        toast.error("Failed to load hotel data");
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id, methods]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
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

      toast.success("Hotel updated successfully!");
      setTimeout(() => navigate("/host/listings"), 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update hotel");
    } finally {
      setSaving(false);
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
      <Container maxWidth="md" >
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
              color: "#FF385C",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                bgcolor: "rgba(255,56,92,0.08)",
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
                <SubmitSection onSubmit={methods.handleSubmit(onSubmit)} loading={saving}  />
              </Box>
            </Box>
          </FormProvider>
        </Paper>
      </Container>
    </HostLayout>
  );
};

export default EditHotel;
