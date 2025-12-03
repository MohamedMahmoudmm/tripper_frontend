import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Divider,
  Box,
  CircularProgress,
  Button,
  Stack,
} from "@mui/material";
import { ArrowBackIosNew, Edit } from "@mui/icons-material";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import { editHotelSchema } from "../validation/hotelSchema";
import ListingDetailsForm from "../../../components/host/hotel/ListingDetailsForm";
import AmenitiesForm from "../../../components/host/hotel/AmenitiesForm";
import PhotosUploader from "../../../components/host/hotel/PhotosUploader";
import RoomsForm from "../../../components/host/hotel/RoomsForm";
import SubmitSection from "../../../components/host/hotel/SubmitSection";
import HostLayout from "../../../components/host/HostLayout";
import hotelService from "../../../services/hotels.service";

const EditHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasRooms, setHasRooms] = useState(false);

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
      rooms: [],
    },
  });

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const hotel = await hotelService.getHotelById(id);

        const roomsExist = hotel.rooms && hotel.rooms.length > 0;
        setHasRooms(roomsExist);

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
          price: roomsExist ? null : hotel.price || null,
          country: hotel.address?.country || "",
          city: hotel.address?.city || "",
          street: hotel.address?.street || "",
          amenities: normalizedAmenities,
          oldPhotos: hotel.images || [],
          photos: [],
          rooms: roomsExist ? hotel.rooms : [],
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

      const roomsExist = data.rooms && data.rooms.length > 0;

      const payload = {
        name: data.title,
        description: data.description,
        price: roomsExist ? 0 : Number(data.price),
        address: {
          country: data.country,
          city: data.city,
          street: data.street,
        },
        amenities: data.amenities,
        rooms: roomsExist ? data.rooms : [],
        images: data.oldPhotos,
      };

      await hotelService.updateHotel(id, payload);

      if (data.photos && data.photos.length > 0) {
        const formData = new FormData();
        data.photos.forEach((file) => {
          formData.append("images", file);
        });

        await hotelService.updateHotelImages(id, formData);
      }
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
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="70vh"
          gap={3}
        >
          <CircularProgress size={60} sx={{ color: "#667eea" }} />
          <Typography variant="h6" color="text.secondary">
            Loading property details...
          </Typography>
        </Box>
      </HostLayout>
    );

  return (
    <HostLayout>
      {/* Hero Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          py: { xs: 4, md: 6 },
          mb: 4,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
          }}
        />
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Edit sx={{ fontSize: 40, color: "#fff" }} />
                <Typography 
                  variant="h3" 
                  fontWeight="bold" 
                  color="#fff" 
                  sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
                >
                  Edit Property
                </Typography>
              </Stack>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: "rgba(255,255,255,0.9)", 
                  fontSize: { xs: "0.95rem", md: "1.1rem" } 
                }}
              >
                Update your property details and keep your listing fresh
              </Typography>
            </Box>
            <Button
              startIcon={<ArrowBackIosNew />}
              onClick={() => navigate(-1)}
              sx={{
                color: "#fff",
                backgroundColor: "rgba(255,255,255,0.2)",
                fontWeight: 600,
                textTransform: "none",
                px: 3,
                py: 1.2,
                borderRadius: 2,
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.3)",
                },
              }}
            >
              Back
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            mb: 4,
          }}
        >
          <FormProvider {...methods}>
            <Box component="form" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
              <Box sx={{ p: { xs: 3, md: 5 } }}>
                <Stack spacing={5}>
                  {/* Section 1: Property Details */}
                  <Box>
                    <Typography variant="overline" color="text.secondary" fontWeight="600" mb={1} display="block">
                      SECTION 1
                    </Typography>
                    <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: "2px solid #E8E8E8", borderRadius: 3, backgroundColor: "#FAFAFA" }}>
                      <ListingDetailsForm />
                    </Paper>
                  </Box>

                  <Divider sx={{ my: 2 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ px: 2 }}>
                      •••
                    </Typography>
                  </Divider>

                  {/* Section 2: Amenities */}
                  <Box>
                    <Typography variant="overline" color="text.secondary" fontWeight="600" mb={1} display="block">
                      SECTION 2
                    </Typography>
                    <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: "2px solid #E8E8E8", borderRadius: 3, backgroundColor: "#FAFAFA" }}>
                      <AmenitiesForm />
                    </Paper>
                  </Box>

                  {/* Section 3: Rooms */}
                  {methods.watch("rooms")?.length > 0 && (
                    <>
                      <Divider sx={{ my: 2 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ px: 2 }}>
                          •••
                        </Typography>
                      </Divider>

                      <Box>
                        <Typography variant="overline" color="text.secondary" fontWeight="600" mb={1} display="block">
                          SECTION 3
                        </Typography>
                        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: "2px solid #E8E8E8", borderRadius: 3, backgroundColor: "#FAFAFA" }}>
                          <RoomsForm showRooms={true} />
                        </Paper>
                      </Box>
                    </>
                  )}

                  <Divider sx={{ my: 2 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ px: 2 }}>
                      •••
                    </Typography>
                  </Divider>

                  {/* Section 4: Photos */}
                  <Box>
                    <Typography variant="overline" color="text.secondary" fontWeight="600" mb={1} display="block">
                      {methods.watch("rooms")?.length > 0 ? "SECTION 4" : "SECTION 3"}
                    </Typography>
                    <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: "2px solid #E8E8E8", borderRadius: 3, backgroundColor: "#FAFAFA" }}>
                      <PhotosUploader />
                    </Paper>
                  </Box>
                </Stack>

                {/* Submit Section */}
                <Box
                  sx={{
                    mt: 6,
                    pt: 4,
                    borderTop: "2px dashed #E0E0E0",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" mb={1} color="#222">
                    Save Your Changes
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Review your updates before saving the property listing
                  </Typography>
                  <SubmitSection loading={saving} />
                </Box>
              </Box>
            </Box>
          </FormProvider>
        </Paper>
      </Container>
    </HostLayout>
  );
};

export default EditHotel;