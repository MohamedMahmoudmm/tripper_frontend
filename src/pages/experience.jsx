import React, { useState, useEffect } from "react";
import PopularHomesCarousel from "../components/sharedComponents/PopularHomesCarousel";
import experienceService from "../services/experince.service";
import PriceFilter from "../components/sharedComponents/PriceFilter";
import SearchBar from "../components/sharedComponents/SearchBar";
import {
  Box,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  Alert,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import {
  Clear as ClearIcon,
  LocationOn as LocationIcon,
  Sort as SortIcon,
} from "@mui/icons-material";

export default function ExperiencePage() {
  const [cityExperiences, setCityExperiences] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState("default");

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
            image:
              exp.images?.[0] ||
              "https://via.placeholder.com/300x200?text=No+Image",
            title: exp.name,
            rating: exp.starRating || 4.8,
            price: `${Number(exp.price) || 0} ج.م / person`,
            numericPrice: Number(exp.price) || 0,
            id: exp._id,
            model: "experiance",
          });
          return acc;
        }, {});

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

  const getFilteredExperiences = () => {
    let result = Object.keys(cityExperiences)
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

    // Apply sorting
    if (sortBy === "price_low") {
      result.forEach((item) => {
        item.experiences.sort((a, b) => a.numericPrice - b.numericPrice);
      });
    } else if (sortBy === "price_high") {
      result.forEach((item) => {
        item.experiences.sort((a, b) => b.numericPrice - a.numericPrice);
      });
    } else if (sortBy === "rating") {
      result.forEach((item) => {
        item.experiences.sort((a, b) => b.rating - a.rating);
      });
    }

    return result;
  };

  const filteredData = getFilteredExperiences();
  const hasActiveFilters =
    selectedCity !== "All" ||
    priceRange[0] !== 0 ||
    priceRange[1] !== maxPrice ||
    searchQuery !== "" ||
    sortBy !== "default";

  const handleClearFilters = () => {
    setSelectedCity("All");
    setPriceRange([0, maxPrice]);
    setSearchQuery("");
    setSortBy("default");
  };

  return (
    <Box sx={{ pb: 6, minHeight: "100vh" }}>
      {/* MINIMAL FILTERS BAR */}
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
          {/* Search */}
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search experiences..."
            onClear={() => setSearchQuery("")}
          />

          <Divider orientation="vertical" flexItem />

          {/* City Filter */}
          <Button
            size="small"
            startIcon={<LocationIcon sx={{ fontSize: 18 }} />}
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
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              variant="standard"
              disableUnderline
              sx={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#666",
                "& .MuiSelect-select": {
                  padding: 0,
                  paddingRight: "20px !important",
                  "&:focus": {
                    bgcolor: "transparent",
                  },
                },
                "& .MuiSelect-icon": {
                  right: 0,
                },
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
              {cities.map((city, index) => (
                <MenuItem
                  key={index}
                  value={city}
                  sx={{
                    fontSize: "0.875rem",
                    "&:hover": {
                      bgcolor: "#f5f5f5",
                    },
                  }}
                >
                  {city}
                </MenuItem>
              ))}
            </Select>
          </Button>

          <Divider orientation="vertical" flexItem />

          {/* Price Filter */}
          <PriceFilter
            value={priceRange}
            maxPrice={maxPrice}
            onChange={(newRange) => setPriceRange(newRange)}
          />

          <Divider orientation="vertical" flexItem />

          {/* Sort */}
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
                  "&:focus": {
                    bgcolor: "transparent",
                  },
                },
                "& .MuiSelect-icon": {
                  right: 0,
                },
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
              <MenuItem value="default" sx={{ fontSize: "0.875rem" }}>
                Default
              </MenuItem>
              <MenuItem value="price_low" sx={{ fontSize: "0.875rem" }}>
                Price: Low to High
              </MenuItem>
              <MenuItem value="price_high" sx={{ fontSize: "0.875rem" }}>
                Price: High to Low
              </MenuItem>
              <MenuItem value="rating" sx={{ fontSize: "0.875rem" }}>
                Highest Rated
              </MenuItem>
            </Select>
          </Button>

          {hasActiveFilters && (
            <>
              <Divider orientation="vertical" flexItem />
              <Button
                size="small"
                startIcon={<ClearIcon sx={{ fontSize: 16 }} />}
                onClick={handleClearFilters}
                sx={{
                  color: "#999",
                  textTransform: "none",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  px: 1.5,
                  py: 0.5,
                  minWidth: "auto",
                  whiteSpace: "nowrap",
                  borderRadius: 0,
                  "&:hover": {
                    bgcolor: "#fff5f5",
                    color: "#f27244",
                  },
                }}
              >
                Clear
              </Button>
            </>
          )}
        </Stack>
      </Box>

      {/* RESULTS SECTION */}
      <Box sx={{ mt: 3 }}>
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
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your filters
            </Typography>
            {hasActiveFilters && (
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                sx={{
                  borderColor: "#f27244",
                  color: "#f27244",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#d96135",
                    bgcolor: "rgba(242, 114, 68, 0.04)",
                  },
                }}
              >
                Clear All Filters
              </Button>
            )}
          </Box>
        ) : (
          filteredData.map(({ city, experiences }) => (
            <Box key={city} sx={{ mb: 4 }}>
              <PopularHomesCarousel
                homes={experiences}
                title={`Popular Experiences in ${city}`}
              />
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}