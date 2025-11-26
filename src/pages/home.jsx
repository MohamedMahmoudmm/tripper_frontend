import React, { useState, useEffect } from "react";
import PopularHomesCarousel from "../components/sharedComponents/PopularHomesCarousel";
import hotelService from "../services/hotels.service";
import { Box, FormControl, Select, MenuItem, InputLabel } from "@mui/material";

const HomePage = () => {
  const [cityHotels, setCityHotels] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("All");

  useEffect(() => {
    const fetchHotelsByCity = async () => {
      try {
        const allHotels = await hotelService.getAllHotels();

        const groupedByCity = allHotels.reduce((acc, hotel) => {
          let city = hotel.address?.city || "Other";
          city = city.trim().toLowerCase();
          const cityDisplay = city.charAt(0).toUpperCase() + city.slice(1);

          if (!acc[cityDisplay]) acc[cityDisplay] = [];
          acc[cityDisplay].push({
            image: hotel.images?.[0] || "https://via.placeholder.com/150",
            title: hotel.name,
            rating: hotel.starRating || 4.5,
            price: `${hotel.price} ج.م / night`,
            id: hotel._id,
            model: "hotel",
          });
          return acc;
        }, {});

        setCityHotels(groupedByCity);
      } catch (err) {
        console.error("Error loading hotels:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelsByCity();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading hotels...</p>;

  const cities = ["All", ...Object.keys(cityHotels)];

  return (
    <Box sx={{ pb: 6 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 3,
          mb: 4,
        }}
      >
        <FormControl
          sx={{
            width: "250px",
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderRadius: "8px",
          }}
        >
          <InputLabel id="city-select-label">Select City</InputLabel>
          <Select
            labelId="city-select-label"
            value={selectedCity}
            label="Select City"
            onChange={(e) => setSelectedCity(e.target.value)}
            sx={{
              borderRadius: "8px",
            }}
          >
            {cities.map((city, index) => (
              <MenuItem key={index} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {Object.keys(cityHotels)
        .filter((city) => selectedCity === "All" || city === selectedCity)
        .map((city) => (
          <Box key={city} sx={{ mb: 6 }}>
            <PopularHomesCarousel
              homes={cityHotels[city]}
              title={`Popular Hotels in ${city}`}
            />
          </Box>
        ))}
    </Box>
  );
};

export default HomePage;
