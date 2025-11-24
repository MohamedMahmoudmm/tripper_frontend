import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Grid, Pagination, TextField } from "@mui/material";
import experienceService from "../services/experince.service";
import HomeCard from "../components/sharedComponents/HomeCard";

export default function CityExperiencePage() {
  const { city } = useParams();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [page, setPage] = useState(1);
  const limit = 6;

  // Search state
  const [search, setSearch] = useState("");

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

  // ----- Search filtering BEFORE pagination -----
  const filtered = experiences.filter((exp) =>
    exp.title.toLowerCase().includes(search.toLowerCase())
  );

  // ----- Pagination logic -----
  const totalPages = Math.ceil(filtered.length / limit);
  const start = (page - 1) * limit;
  const paginatedExperiences = filtered.slice(start, start + limit);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        All Experiences in {city.charAt(0).toUpperCase() + city.slice(1)}
      </Typography>

     
{/* 🔍 Improved Search Bar */}
<Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
  <TextField
    variant="outlined"
    placeholder="Search experiences..."
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);
      setPage(1);
    }}
    InputProps={{
      startAdornment: (
        <i className="bi bi-search" style={{ marginRight: 8, opacity: 0.7 }}></i>
      ),
      sx: {
        borderRadius: "50px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        "& fieldset": {
          borderRadius: "50px",
        },
      },
    }}
    sx={{
      width: "100%",
      maxWidth: 350, // 🤏 Not full width
    }}
  />
</Box>


      <Grid container spacing={3}>
        {paginatedExperiences.map((exp, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <HomeCard {...exp} />
          </Grid>
        ))}
      </Grid>

      {/* Pagination Component */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
}
