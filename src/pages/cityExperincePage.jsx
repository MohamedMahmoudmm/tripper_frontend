import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Grid } from "@mui/material";
import experienceService from "../services/experince.service";
import HomeCard from "../components/sharedComponents/HomeCard";

export default function CityExperiencePage() {
  const { city } = useParams();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCityExperiences = async () => {
      try {
        const data = await experienceService.getAllExperiences();

        const filtered = data.filter(
          (exp) => exp.address?.city?.toLowerCase() === city.toLowerCase()
        );

        const formatted = filtered.map((exp) => ({
          image: exp.images?.[0] || "https://via.placeholder.com/400",
          title: exp.name,
          rating: exp.starRating || 4.8,
          price: exp.price ? `${exp.price} ج.م` : "Price not set",
          id: exp._id,
          model: "experience",
        }));

        setExperiences(formatted);
      } catch (err) {
        console.error("Error fetching experiences for city:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCityExperiences();
  }, [city]);

  if (loading)
    return <p style={{ textAlign: "center" }}>Loading experiences...</p>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        All Experiences in {city.charAt(0).toUpperCase() + city.slice(1)}
      </Typography>

      <Grid container spacing={3}>
        {experiences.map((exp, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <HomeCard {...exp} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
