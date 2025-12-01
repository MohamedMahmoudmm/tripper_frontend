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
} from "@mui/material";

export default function ExperiencePage() {
  const [cityExperiences, setCityExperiences] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [maxPrice, setMaxPrice] = useState(5000);

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
        <Box sx={{ mb: 3 }}>
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search experiences by name..."
            onClear={() => setSearchQuery("")}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
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

          <Box sx={{ flex: { xs: "1", md: "0 0 40%" } }}>
            <PriceFilter
              value={priceRange}
              maxPrice={maxPrice}
              onChange={(newRange) => setPriceRange(newRange)}
            />
          </Box>
        </Box>
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