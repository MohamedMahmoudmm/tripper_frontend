import React, { useState, useEffect } from "react";
import PopularHomesCarousel from "../components/sharedComponents/PopularHomesCarousel";
import hotelService from "../services/hotels.service";
import PriceFilter from "../components/sharedComponents/PriceFilter";
import SearchBar from "../components/sharedComponents/SearchBar";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
  Typography,
  Alert,
} from "@mui/material";

const HomePage = () => {
  const [cityHotels, setCityHotels] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [maxPrice, setMaxPrice] = useState(5000);

  useEffect(() => {
    const fetchHotelsByCity = async () => {
      try {
        setLoading(true);
        setError(null);

        const allHotels = await hotelService.getAllHotels();

        if (!allHotels || allHotels.length === 0) {
          setCityHotels({});
          setLoading(false);
          return;
        }

        const groupedByCity = allHotels.reduce((acc, hotel) => {
          let city = hotel.address?.city || "Other";
          city = city.trim().toLowerCase();
          const cityDisplay = city.charAt(0).toUpperCase() + city.slice(1);

          if (!acc[cityDisplay]) acc[cityDisplay] = [];

          let displayPrice = hotel.price;
          if (hotel.rooms && hotel.rooms.length > 0) {
            const roomPrices = hotel.rooms.map((r) => r.price);
            displayPrice = Math.min(...roomPrices);
          }

          acc[cityDisplay].push({
            image: hotel.images?.[0] || "https://via.placeholder.com/300x200?text=No+Image",
            title: hotel.name,
            rating: hotel.starRating || 4.5,
            price: `${displayPrice} ج.م / night`,
            numericPrice: displayPrice,
            id: hotel._id,
            model: "hotel",
          });

          return acc;
        }, {});

        // Calculate min and max prices
        const allPrices = allHotels
          .map((h) => Number(h.price) || 0)
          .filter((p) => p > 0);

        if (allPrices.length > 0) {
          const maxP = Math.max(...allPrices);
          const minP = Math.min(...allPrices);
          setMaxPrice(maxP);
          setPriceRange([minP, maxP]);
        }

        setCityHotels(groupedByCity);
      } catch (err) {
        console.error("Error loading hotels:", err);
        setError("Failed to load hotels. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotelsByCity();
  }, []);

  // Loading State
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#f27244" }} />
      </Box>
    );
  }

  // Error State
  if (error) {
    return (
      <Box sx={{ px: { xs: 2, md: 6 }, py: 4 }}>
        <Alert severity="error" sx={{ maxWidth: 600, mx: "auto" }}>
          {error}
        </Alert>
      </Box>
    );
  }

  const cities = ["All", ...Object.keys(cityHotels)];

  // Filter hotels based on selected city, price range, and search query
  const getFilteredHotels = () => {
    return Object.keys(cityHotels)
      .filter((city) => selectedCity === "All" || city === selectedCity)
      .map((city) => {
        const filteredHotels = cityHotels[city].filter((hotel) => {
          const matchesPrice =
            hotel.numericPrice >= priceRange[0] &&
            hotel.numericPrice <= priceRange[1];

          const matchesSearch = hotel.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

          return matchesPrice && matchesSearch;
        });

        return { city, hotels: filteredHotels };
      })
      .filter((item) => item.hotels.length > 0);
  };

  const filteredData = getFilteredHotels();

  return (
    <Box sx={{ pb: 6 }}>
      {/* FILTERS SECTION */}
      <Box
        sx={{
          mt: 3,
          mb: 4,
          px: { xs: 2, md: 6 },
        }}
      >
        {/* Search Bar - Full Width */}
        <Box sx={{ mb: 3 }}>
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hotels by name..."
            onClear={() => setSearchQuery("")}
          />
        </Box>

        {/* City Select and Price Filter - Side by Side */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* City Dropdown */}
          <Box sx={{ flex: { xs: "1", md: "0 0 40%" } }}>
            <FormControl
              fullWidth
              sx={{
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
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#f27244",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#f27244",
                  },
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

          {/* Price Filter */}
          <Box sx={{ flex: { xs: "1", md: "0 0 40%" } }}>
            <PriceFilter
              value={priceRange}
              maxPrice={maxPrice}
              onChange={(newRange) => setPriceRange(newRange)}
            />
          </Box>
        </Box>
      </Box>

      {/* FILTERED HOTELS */}
      {filteredData.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hotels found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or search query
          </Typography>
        </Box>
      ) : (
        filteredData.map(({ city, hotels }) => (
          <Box key={city} sx={{ mb: 6 }}>
            <PopularHomesCarousel
              homes={hotels}
              title={`Popular Hotels in ${city}`}
            />
          </Box>
        ))
      )}
    </Box>
  );
};

export default HomePage;