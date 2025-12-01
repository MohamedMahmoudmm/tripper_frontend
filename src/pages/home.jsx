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
  Chip,
  Button,
  Collapse,
  IconButton,
  useMediaQuery,
  useTheme,
  Grid,
  Paper,
} from "@mui/material";
import {
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  LocationOn as LocationOnIcon,
  AttachMoney as AttachMoneyIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  const [cityHotels, setCityHotels] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [showFilters, setShowFilters] = useState(true);

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

  // Check if filters are active
  const hasActiveFilters = selectedCity !== "All" || 
                          priceRange[0] !== 0 || 
                          priceRange[1] !== maxPrice ||
                          searchQuery !== "";

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCity("All");
    setPriceRange([0, maxPrice]);
    setSearchQuery("");
  };

  return (
    <Box sx={{ pb: 3 }}>
      {/* FILTERS SECTION */}
      <Box
        sx={{
          mt: 2,
          mb: 2,
          px: { xs: 2, md: 6 },
        }}
      >
        {/* Filter Header with Toggle (Mobile) */}
        {isMobile && (
          <Box sx={{ mb: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                borderColor: "#f27244",
                color: "#f27244",
                borderRadius: "12px",
                py: 1.5,
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#d96135",
                  backgroundColor: "rgba(242, 114, 68, 0.04)",
                },
              }}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
              {hasActiveFilters && (
                <Chip
                  label={filteredData.reduce((acc, item) => acc + item.hotels.length, 0)}
                  size="small"
                  sx={{
                    ml: 1,
                    backgroundColor: "#f27244",
                    color: "white",
                    height: "20px",
                  }}
                />
              )}
            </Button>
          </Box>
        )}

        <Collapse in={showFilters || !isMobile}>
          {/* Combined Filters Box */}
        
            <Grid container spacing={3} alignItems="center" justifyContent="center">
              {/* Search Field */}
              <Grid item xs={12} md={4} >
                
                <SearchBar
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Hotel name, location..."
                  onClear={() => setSearchQuery("")}
                  fullWidth
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>

              {/* City Selection */}
              <Grid item xs={12} md={4} >
                
                <FormControl
                  fullWidth
                  sx={{
                    px: 1,
                    backgroundColor: "white",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(242, 114, 68, 0.1)",
                    },
                  }}
                >
                  <InputLabel 
                    id="city-select-label"
                    sx={{
                      "&.Mui-focused": {
                        color: "#f27244",
                      },
                    }}
                  >
                    All Cities
                  </InputLabel>
                  <Select
                    labelId="city-select-label"
                    value={selectedCity}
                    label="All Cities"
                    onChange={(e) => setSelectedCity(e.target.value)}
                    sx={{
                      borderRadius: "12px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "transparent",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(242, 114, 68, 0.3)",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#f27244",
                        borderWidth: "2px",
                      },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          borderRadius: "12px",
                          mt: 1,
                          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        },
                      },
                    }}
                  >
                    {cities.map((city, index) => (
                      <MenuItem 
                        key={index} 
                        value={city}
                        sx={{
                          "&:hover": {
                            backgroundColor: "rgba(242, 114, 68, 0.08)",
                          },
                          "&.Mui-selected": {
                            backgroundColor: "rgba(242, 114, 68, 0.12)",
                            fontWeight: 600,
                          },
                        }}
                      >
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Price Range */}
              <Grid item xs={12} md={4} >
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <AttachMoneyIcon sx={{ fontSize: 18, color: "#f27244" }} />
                  Price Range
                </Typography>
                
                  <PriceFilter
                    value={priceRange}
                    maxPrice={maxPrice}
                    onChange={(newRange) => setPriceRange(newRange)}
                    compact
                  />
              </Grid>
            </Grid>

           
        </Collapse>

      
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
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your filters or search query
          </Typography>
          {hasActiveFilters && (
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
              sx={{
                borderColor: "#f27244",
                color: "#f27244",
                px: 4,
                "&:hover": {
                  borderColor: "#d96135",
                  backgroundColor: "rgba(242, 114, 68, 0.04)",
                },
              }}
            >
              Clear All Filters
            </Button>
          )}
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