import React, { useState, useEffect } from "react";
import PopularHomesCarousel from "../components/sharedComponents/PopularHomesCarousel";
import experienceService from "../services/experince.service";
import { Box, FormControl, Select, MenuItem, InputLabel } from "@mui/material";

export default function ExperiencePage() {
  const [cityExperiences, setCityExperiences] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("All");

  useEffect(() => {
    const fetchExperiencesByCity = async () => {
      try {
        const allExperiences = await experienceService.getAllExperiences();

        const groupedByCity = allExperiences.reduce((acc, exp) => {
          const city = exp.address?.city
            ? exp.address.city.trim().toLowerCase()
            : "Other";
          const cityDisplay = city.charAt(0).toUpperCase() + city.slice(1);

          if (!acc[cityDisplay]) acc[cityDisplay] = [];
          acc[cityDisplay].push({
            image: exp.images?.[0] || "https://via.placeholder.com/400",
            title: exp.name,
            rating: exp.starRating || 4.8,
            price: exp.price ? `${exp.price} ج.م` : "Price not set",
            id: exp._id,
            model: "experiance",
          });

          return acc;
        }, {});


        setCityExperiences(groupedByCity);
      } catch (err) {
        console.error("Error fetching experiences:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiencesByCity();
  }, []);

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        Loading Experiences...
      </p>
    );
  }

  const cities = ["All", ...Object.keys(cityExperiences)];

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

      {Object.keys(cityExperiences)
        .filter((city) => selectedCity === "All" || city === selectedCity)
        .map((city) => (
          <Box key={city} sx={{ mb: 6 }}>
            <PopularHomesCarousel
              homes={cityExperiences[city]}
              title={`Popular Experiences in ${city}`}
            />
          </Box>
        ))}
    </Box>
  );
}
