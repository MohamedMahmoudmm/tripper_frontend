import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Grid } from "@mui/material";
import hotelService from "../services/hotels.service";
import HomeCard from "../components/sharedComponents/HomeCard";
import SearchBar from "../components/sharedComponents/SearchBar";
import PaginationBar from "../components/sharedComponents/Pagination";

export default function CityHotelsPage() {
  const { city } = useParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [page, setPage] = useState(1);
  const limit = 6;

  // Search
  const [search, setSearch] = useState("");

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

  if (loading)
    return <p style={{ textAlign: "center" }}>Loading hotels...</p>;

  // ----- Search filter BEFORE pagination -----
  const filteredHotels = hotels.filter((hotel) =>
    hotel.title.toLowerCase().includes(search.toLowerCase())
  );

  // ----- Pagination logic -----
  const totalPages = Math.ceil(filteredHotels.length / limit);
  const start = (page - 1) * limit;
  const paginatedHotels = filteredHotels.slice(start, start + limit);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        All Hotels in {city.charAt(0).toUpperCase() + city.slice(1)}
      </Typography>
    {/* search bar */}
    <SearchBar
  value={search}
  onChange={(e) => {
    setSearch(e.target.value);
    setPage(1);
  }}
  placeholder="Search hotels..."
/>


      <Grid container spacing={3}>
        {paginatedHotels.length > 0 ? (
          paginatedHotels.map((hotel, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <HomeCard {...hotel} />
            </Grid>
          ))
        ) : (
          <Typography
            sx={{ textAlign: "center", width: "100%", mt: 4 }}
            color="text.secondary"
          >
            No hotels found.
          </Typography>
        )}
      </Grid>

  <PaginationBar
  page={page}
  totalPages={totalPages}
  onChange={(value) => setPage(value)}
/>

    </Box>
  );
}
