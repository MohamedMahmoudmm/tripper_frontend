import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Tabs,
  Tab,
  Stack,
  Divider,
} from "@mui/material";
import { ArrowBackIosNew, Hotel, Villa, Apartment } from "@mui/icons-material";
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
import RoomsForm from "../../../components/host/hotel/RoomsForm";

const AddHotel = () => {
  const methods = useForm({
    resolver: yupResolver(addHotelSchema),
    defaultValues: {
      type: "hotel",
      title: "",
      description: "",
      notes: "",
      price: null,
      country: "",
      city: "",
      street: "",
      amenities: [],
      starRating: 0,
      photos: [],
      rooms: [],
    },
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [previousTab, setPreviousTab] = useState(0);

  const tabToType = ["hotel", "villa", "apartment"];
  const tabTitles = ["Hotel", "Villa", "Apartment"];
  const tabIcons = [<Hotel />, <Villa />, <Apartment />];

  const handleTabChange = (event, newTab) => {
    if (newTab === previousTab) return;

    const newType = tabToType[newTab];
       
    const currentTitle = methods.getValues("title");
    const currentDescription = methods.getValues("description");
    const currentCountry = methods.getValues("country");
    const currentCity = methods.getValues("city");
    const currentStreet = methods.getValues("street");
    const currentAmenities = methods.getValues("amenities");
    const currentPhotos = methods.getValues("photos");
    const currentNotes = methods.getValues("notes");
    
    methods.reset({
      type: newType,
      title: currentTitle,
      description: currentDescription,
      notes: currentNotes,
      country: currentCountry,
      city: currentCity,
      street: currentStreet,
      amenities: currentAmenities,
      photos: currentPhotos,
      price: null,
      rooms: [], 
      starRating: 0,
    });

    setTab(newTab);
    setPreviousTab(newTab);
  };

  useEffect(() => {
    methods.setValue("type", tabToType[tab]);
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("type", data.type);
      formData.append("name", data.title);
      formData.append("description", data.description);
      formData.append("notes", data.notes || "");
      formData.append("price", data.type === "hotel" ? 0 : Number(data.price ?? 0));

      formData.append("address[country]", data.country || "Egypt");
      formData.append("address[city]", data.city || "Cairo");
      formData.append("address[street]", data.street || "Any Street");

      (data.amenities || []).forEach((item) => {
        formData.append("amenities[]", item);
      });

      (data.photos || []).forEach((file) => formData.append("images", file));

      if (data.type === "hotel" && data.rooms?.length > 0) {
        data.rooms.forEach((room, index) => {
          formData.append(`rooms[${index}][name]`, room.name);
          formData.append(`rooms[${index}][price]`, room.price);
          formData.append(`rooms[${index}][quantity]`, room.quantity);
          formData.append(`rooms[${index}][maxGuests]`, room.maxGuests);
        });
      }

      await hotelService.addHotel(formData);

      toast.success(`${data.type} added successfully!`);

      methods.reset();
      setTimeout(() => navigate("/host/listings"), 1200);
    } catch (err) {
      console.error("Add property error:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to add listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <HostLayout>
      {/* Hero Header  */}
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
              <Typography 
                variant="h3" 
                fontWeight="bold" 
                color="#fff" 
                mb={1} 
                sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
              >
                Add New Property
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: "rgba(255,255,255,0.9)", 
                  fontSize: { xs: "0.95rem", md: "1.1rem" } 
                }}
              >
                List your property and start earning with our platform
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
          {/* Property Type Selection */}
          <Box sx={{ backgroundColor: "#FAFAFA", px: { xs: 2, md: 4 }, pt: 4, pb: 2 }}>
            <Typography variant="h5" fontWeight="bold" mb={1} color="#222">
              Select Property Type
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Choose the type of property you want to list
            </Typography>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  minHeight: 70,
                  borderRadius: "12px 12px 0 0",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(102, 126, 234, 0.05)",
                  },
                },
                "& .Mui-selected": {
                  color: "#667eea",
                  backgroundColor: "#fff",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#667eea",
                  height: 4,
                  borderRadius: "4px 4px 0 0",
                },
              }}
            >
              {tabTitles.map((title, idx) => (
                <Tab
                  key={idx}
                  icon={tabIcons[idx]}
                  label={title}
                  iconPosition="start"
                  sx={{ gap: 1 }}
                />
              ))}
            </Tabs>
          </Box>

          <FormProvider {...methods}>
            <Box component="form" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
              <Box sx={{ p: { xs: 3, md: 5 } }}>
                <Stack spacing={5}>
                  {/* Section 1: Property Details */}
                  <Box>
                    <Typography variant="overline" color="text.secondary" fontWeight="600" mb={1} display="block">
                      STEP 1
                    </Typography>
                    <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: "2px solid #E8E8E8", borderRadius: 3, backgroundColor: "#FAFAFA" }}>
                      <ListingDetailsForm />
                    </Paper>
                  </Box>

                  <Divider sx={{ my: 2 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ px: 2 }}>
                      STEP 2 OF {methods.watch("type") === "hotel" ? "4" : "3"}
                    </Typography>
                  </Divider>

                  {/* Section 2: Amenities */}
                  <Box>
                    <Typography variant="overline" color="text.secondary" fontWeight="600" mb={1} display="block">
                      STEP 2
                    </Typography>
                    <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: "2px solid #E8E8E8", borderRadius: 3, backgroundColor: "#FAFAFA" }}>
                      <AmenitiesForm />
                    </Paper>
                  </Box>

                  {/* Section 3: Rooms (Hotels only) */}
                  {methods.watch("type") === "hotel" && (
                    <>
                      <Divider sx={{ my: 2 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ px: 2 }}>
                          STEP 3 OF 4
                        </Typography>
                      </Divider>

                      <Box>
                        <Typography variant="overline" color="text.secondary" fontWeight="600" mb={1} display="block">
                          STEP 3
                        </Typography>
                        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: "2px solid #E8E8E8", borderRadius: 3, backgroundColor: "#FAFAFA" }}>
                          <RoomsForm />
                        </Paper>
                      </Box>
                    </>
                  )}

                  <Divider sx={{ my: 2 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ px: 2 }}>
                      {methods.watch("type") === "hotel" ? "STEP 4 OF 4" : "STEP 3 OF 3"}
                    </Typography>
                  </Divider>

                  {/* Section 4: Photos */}
                  <Box>
                    <Typography variant="overline" color="text.secondary" fontWeight="600" mb={1} display="block">
                      {methods.watch("type") === "hotel" ? "STEP 4" : "STEP 3"}
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
                    Ready to Publish?
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Review all details before submitting your property listing
                  </Typography>
                  <SubmitSection loading={loading} />
                </Box>
              </Box>
            </Box>
          </FormProvider>
        </Paper>
      </Container>
    </HostLayout>
  );
};

export default AddHotel;