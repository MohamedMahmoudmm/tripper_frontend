import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Grid, Pagination } from "@mui/material";
import hotelService from "../services/hotels.service";
import HomeCard from "../components/sharedComponents/HomeCard";

export default function CityHotelsPage() {
  const { city } = useParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [page, setPage] = useState(1);
  const limit = 6; // عدد العناصر في الصفحة

  useEffect(() => {
    const fetchCityHotels = async () => {
      try {
        const data = await hotelService.searchHotelsByCity(city);

        const formatted = data.map((h) => ({
          image: h.images?.[0] || "https://via.placeholder.com/150",
          title: h.name,
          rating: h.starRating || 4.5,
          price: `${h.price} ج.م / night`,
          id: h._id,
          model: "hotel",
        }));

        setHotels(formatted);
      } catch (err) {
        console.error("Error fetching hotels for city:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCityHotels();
  }, [city]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading hotels...</p>;

  // ----- Frontend pagination logic -----
  const totalPages = Math.ceil(hotels.length / limit);
  const start = (page - 1) * limit;
  const paginatedHotels = hotels.slice(start, start + limit);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        All Hotels in {city.charAt(0).toUpperCase() + city.slice(1)}
      </Typography>

      <Grid container spacing={3}>
        {paginatedHotels.map((hotel, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <HomeCard {...hotel} />
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
