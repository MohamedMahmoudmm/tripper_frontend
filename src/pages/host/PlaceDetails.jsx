import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import {
  Hotel as HotelIcon,
  Explore as ExploreIcon,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiousInstance/axoiusInstance";
import hotelService from "../../services/hotels.service";
import experienceService from "../../services/experince.service";
import HomeCard from "../../components/sharedComponents/HomeCard";
import GridImages from "../../components/detailsComponents/gridImages";

const PlaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [place, setPlace] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch place details
        const placeRes = await axiosInstance.get(`/places/${id}`);
        const placeData = placeRes.data.data || placeRes.data;
        setPlace(placeData);

        // Get city from place
        const city = placeData.address?.city || placeData.location?.city || placeData.city;

        if (city) {
          // Fetch hotels in this city
          const hotelsRes = await hotelService.searchHotelsByCity(city);
          setHotels(hotelsRes);

          // Fetch experiences in this city
          const expRes = await experienceService.searchExperiencesByCity( city );
          setExperiences(expRes);
        }
      } catch (err) {
        console.error("Failed to fetch place details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleCreatePlan = () => {
    // Navigate to create plan page with place data
    navigate("/plans/create", {
      state: {
        place,
        hotels,
        experiences,
      },
    });
  };

const getPrice = (item) => {
    if (item.propertyType === "hotel") {
      if (item.rooms && item.rooms.length > 0) {
        return Math.min(...item.rooms.map((r) => r.price));
      }
      return item.price ?? 0;
    }
    return item.price ?? 0;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!place) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" textAlign="center">
          ⚠️ Place not found
        </Typography>
      </Container>
    );
  }

  const city = place.address?.city || place.location?.city || place.city;

  return (
    <Container sx={{ py: 4 }}>
      {/* Place Header */}
 {/* استبدل الكارد القديم كله بالكود ده */}
<GridImages
  images={place.images || []}
  title={place.name}
  itemId={place._id}
  itemType="Place"  // مهم جدًا عشان الفيفوريت يشتغل صح
  location={place.address || place.location}
  rating={place.starRating || 4.8}
  city={city}
  onCreatePlan={handleCreatePlan} // هنعدل الكومبوننت شوية عشان يقبل ده
/>

      {/* Tabs for Hotels & Experiences */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            "& .MuiTab-root": {
              fontWeight: 600,
              fontSize: "1rem",
            },
            "& .Mui-selected": {
              color: "#f27244 !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#f27244",
            },
          }}
        >
          <Tab icon={<HotelIcon />} iconPosition="start" label={`Hotels (${hotels.length})`} />
          <Tab icon={<ExploreIcon />} iconPosition="start" label={`Experiences (${experiences.length})`} />
        </Tabs>
      </Box>

      {/* Hotels Tab */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {hotels.length > 0 ? (
           hotels.map((hotel) => (
  <Grid item xs={12} sm={6} md={4} key={hotel._id}>
    <HomeCard
      id={hotel._id}
      image={hotel.images?.[0]}
      title={hotel.name}
      price={`From ${getPrice(hotel)} EGP / night`}
      rating={hotel.starRating || 0}
      model="hotel"
    />
  </Grid>
))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: "center", py: 4 }}>
                <HotelIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No hotels found in {city}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}

      {/* Experiences Tab */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          {experiences.length > 0 ? (
          experiences.map((exp) => (
  <Grid item xs={12} sm={6} md={4} key={exp._id}>
    <HomeCard
      id={exp._id}
      image={exp.images?.[0]}
      title={exp.name}
      price={`${exp.price} EGP / person`}
      rating={exp.starRating || 0}
      model="experiance"
    />
  </Grid>
))

          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: "center", py: 4 }}>
                <ExploreIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No experiences found in {city}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
          </Container>
  );
};

export default PlaceDetails;