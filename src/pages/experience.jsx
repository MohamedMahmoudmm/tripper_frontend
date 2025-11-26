import React, { useState, useEffect } from "react";
import PopularHomesCarousel from "../components/sharedComponents/PopularHomesCarousel";
import experienceService from "../services/experince.service";
import PriceFilter from "../components/sharedComponents/PriceFilter";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";


export default function ExperiencePage() {
  const [cityExperiences, setCityExperiences] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("All");

  const [priceRange, setPriceRange] = useState([0, 0]);
  const [maxPrice, setMaxPrice] = useState(5000);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const all = await experienceService.getAllExperiences();

        const groupedByCity = all.reduce((acc, exp) => {
          const city = exp.address?.city
            ? exp.address.city.trim().toLowerCase()
            : "Other";

          const cityDisplay = city.charAt(0).toUpperCase() + city.slice(1);

          if (!acc[cityDisplay]) acc[cityDisplay] = [];

          acc[cityDisplay].push({
            image: exp.images?.[0] || "https://via.placeholder.com/400",
            title: exp.name,
            rating: exp.starRating || 4.8,
            price: Number(exp.price) || 0,
            id: exp._id,
            model: "experiance",
          });
          return acc;
        }, {});

        // Prices
        const allPrices = all.map((e) => Number(e.price) || 0);
        const minP = Math.min(...allPrices);
        const maxP = Math.max(...allPrices);

        setMaxPrice(maxP);
        setPriceRange([minP, maxP]);

        setCityExperiences(groupedByCity);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading experiences...</p>;

  const cities = ["All", ...Object.keys(cityExperiences)];

  return (
    <Box sx={{ pb: 6 }}>
      
      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 3,
          mb: 4,
          gap:4,
          flexWrap: "wrap",
        }}
      >
        {/* City Filter */}
        <FormControl
          sx={{
            width: "250px",
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            mb: 2,
          }}
        >
          <InputLabel id="city-select-label">Select City</InputLabel>
          <Select
            labelId="city-select-label"
            value={selectedCity}
            label="Select City"
            onChange={(e) => setSelectedCity(e.target.value)}
            sx={{ borderRadius: "8px" }}
          >
            {cities.map((city, index) => (
              <MenuItem key={index} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Price Filter Component */}
        <PriceFilter
          value={priceRange}
          maxPrice={maxPrice}
          onChange={(newRange) => setPriceRange(newRange)}
        />
      </Box>

      {/* Filtered Experiences */}
      {Object.keys(cityExperiences)
        .filter((city) => selectedCity === "All" || city === selectedCity)
        .map((city) => {
          const filtered = cityExperiences[city].filter(
            (exp) =>
              exp.price >= priceRange[0] && exp.price <= priceRange[1]
          );

          if (filtered.length === 0) return null;

          return (
            <Box key={city} sx={{ mb: 6 }}>
              <PopularHomesCarousel
                homes={filtered}
                title={`Popular Experiences in ${city}`}
              />
            </Box>
          );
        })}
    </Box>
  );
}
