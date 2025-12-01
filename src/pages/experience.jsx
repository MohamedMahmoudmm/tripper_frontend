import React, { useState, useEffect } from "react";
import PopularHomesCarousel from "../components/sharedComponents/PopularHomesCarousel";
import experienceService from "../services/experince.service";
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
  Grid,
  useTheme,
  useMediaQuery,
  Chip,
  Collapse,
  Button,
} from "@mui/material";
import {
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  LocationOn as LocationOnIcon,
  AttachMoney as AttachMoneyIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
export default function ExperiencePage() {
  const [cityExperiences, setCityExperiences] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [maxPrice, setMaxPrice] = useState(5000); 
   const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        setError(null);

        const all = await experienceService.getAllExperiences();

        if (!all || all.length === 0) {
          setCityExperiences({});
          setLoading(false);
          return;
        }

        const groupedByCity = all.reduce((acc, exp) => {
          const city = exp.address?.city
            ? exp.address.city.trim().toLowerCase()
            : "Other";

          const cityDisplay = city.charAt(0).toUpperCase() + city.slice(1);

          if (!acc[cityDisplay]) acc[cityDisplay] = [];

          acc[cityDisplay].push({
            image: exp.images?.[0] || "https://via.placeholder.com/300x200?text=No+Image",
            title: exp.name,
            rating: exp.starRating || 4.8,
            price: `${Number(exp.price) || 0} ج.م / person`,
            numericPrice: Number(exp.price) || 0,
            id: exp._id,
            model: "experiance",
          });
          return acc;
        }, {});

        // Calculate prices
        const allPrices = all
          .map((e) => Number(e.price) || 0)
          .filter((p) => p > 0);

        if (allPrices.length > 0) {
          const minP = Math.min(...allPrices);
          const maxP = Math.max(...allPrices);
          setMaxPrice(maxP);
          setPriceRange([minP, maxP]);
        }

        setCityExperiences(groupedByCity);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load experiences. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
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

  const cities = ["All", ...Object.keys(cityExperiences)];

  // Filter experiences
  const getFilteredExperiences = () => {
    return Object.keys(cityExperiences)
      .filter((city) => selectedCity === "All" || city === selectedCity)
      .map((city) => {
        const filtered = cityExperiences[city].filter((exp) => {
          const matchesPrice =
            exp.numericPrice >= priceRange[0] &&
            exp.numericPrice <= priceRange[1];

          const matchesSearch = exp.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

          return matchesPrice && matchesSearch;
        });

        return { city, experiences: filtered };
      })
      .filter((item) => item.experiences.length > 0);
  };

  const filteredData = getFilteredExperiences();
  const hasActiveFilters = selectedCity !== "All" || 
                          priceRange[0] !== 0 || 
                          priceRange[1] !== maxPrice ||
                          searchQuery !== "";
  return (
    <Box sx={{ pb: 6 }}>
      {/* FILTERS SECTION */}
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

      {/* Filtered Experiences */}
      {filteredData.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No experiences found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or search query
          </Typography>
        </Box>
      ) : (
        filteredData.map(({ city, experiences }) => (
          <Box key={city} sx={{ mb: 6 }}>
            <PopularHomesCarousel
              homes={experiences}
              title={`Popular Experiences in ${city}`}
            />
          </Box>
        ))
      )}
    </Box>
  );
}