import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Grid, Stack, Select, MenuItem, Button, Divider } from "@mui/material";
import hotelService from "../services/hotels.service";
import HomeCard from "../components/sharedComponents/HomeCard";
import SearchBar from "../components/sharedComponents/SearchBar";
import PaginationBar from "../components/sharedComponents/Pagination";
import PriceFilter from "../components/sharedComponents/PriceFilter";
import { Sort as SortIcon } from "@mui/icons-material";

export default function CityHotelsPage() {
  const { city } = useParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 12;
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const fetchCityHotels = async () => {
      try {
        const data = await hotelService.searchHotelsByCity(city);

        const formatted = data.map((h) => ({
          image: h.images?.[0] || "https://via.placeholder.com/150",
          title: h.name,
          rating: h.starRating || 4.5,
          price: Number(h.price),
          id: h._id,
          model: "hotel",
        }));

        const allPrices = formatted.map((h) => h.price || 0);
        const maxP = Math.max(...allPrices);
        const minP = Math.min(...allPrices);
        setMaxPrice(maxP);
        setPriceRange([minP, maxP]);

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
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <Typography>Loading...</Typography>
      </Box>
    );

  const priceFilteredHotels = hotels.filter(
    (hotel) => hotel.price >= priceRange[0] && hotel.price <= priceRange[1]
  );

  let filteredHotels = priceFilteredHotels.filter((hotel) =>
    hotel.title.toLowerCase().includes(search.toLowerCase())
  );

  // Apply sorting
  if (sortBy === "price_low") {
    filteredHotels = [...filteredHotels].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price_high") {
    filteredHotels = [...filteredHotels].sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filteredHotels = [...filteredHotels].sort((a, b) => b.rating - a.rating);
  }

  const totalPages = Math.ceil(filteredHotels.length / limit);
  const start = (page - 1) * limit;
  const paginatedHotels = filteredHotels.slice(start, start + limit);

  return (
    <Box sx={{ minHeight: "100vh", pb: 6 }}>
      {/* Header */}
      <Box sx={{ bgcolor: "white", borderBottom: "1px solid #e0e0e0", py: 3, px: { xs: 2, md: 6 } }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#333" }}>
          {city.charAt(0).toUpperCase() + city.slice(1)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {filteredHotels.length} hotels available
        </Typography>
      </Box>

      {/* MINIMAL FILTERS */}
      <Box
        sx={{
          position: "sticky",
          top: 64,
          zIndex: 100,
          bgcolor: "white",
          borderBottom: "1px solid #e0e0e0",
          py: 1,
          px: { xs: 2, md: 6 },
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="flex-end"
          sx={{
            overflowX: "auto",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <SearchBar
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search hotels..."
          />

          <Divider orientation="vertical" flexItem />

          <PriceFilter
            value={priceRange}
            maxPrice={maxPrice}
            onChange={(newRange) => setPriceRange(newRange)}
          />

          <Divider orientation="vertical" flexItem />

          <Button
            size="small"
            startIcon={<SortIcon sx={{ fontSize: 18 }} />}
            sx={{
              color: "#666",
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
              px: 1.5,
              py: 0.5,
              minWidth: "auto",
              whiteSpace: "nowrap",
              borderRadius: 0,
            }}
          >
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              variant="standard"
              disableUnderline
              sx={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#666",
                "& .MuiSelect-select": {
                  padding: 0,
                  paddingRight: "20px !important",
                  "&:focus": { bgcolor: "transparent" },
                },
                "& .MuiSelect-icon": { right: 0 },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: "8px",
                    mt: 1,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  },
                },
              }}
            >
              <MenuItem value="default" sx={{ fontSize: "0.875rem" }}>Default</MenuItem>
              <MenuItem value="price_low" sx={{ fontSize: "0.875rem" }}>Price: Low to High</MenuItem>
              <MenuItem value="price_high" sx={{ fontSize: "0.875rem" }}>Price: High to Low</MenuItem>
              <MenuItem value="rating" sx={{ fontSize: "0.875rem" }}>Highest Rated</MenuItem>
            </Select>
          </Button>
        </Stack>
      </Box>

      {/* Hotels Grid */}
      <Box sx={{ px: { xs: 2, md: 6 }, mt: 3 }}>
        <Grid container spacing={3}>
          {paginatedHotels.length > 0 ? (
            paginatedHotels.map((hotel, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <HomeCard {...hotel} price={`${hotel.price} ج.م / night`} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No hotels found
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        {filteredHotels.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <PaginationBar page={page} totalPages={totalPages} onChange={(value) => setPage(value)} />
          </Box>
        )}
      </Box>
    </Box>
  );
}