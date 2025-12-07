import React, { useState, useEffect } from "react";
import PopularHomesCarousel from "../components/sharedComponents/PopularHomesCarousel";
import hotelService from "../services/hotels.service";
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
  Tabs,
  Tab,
} from "@mui/material";
import {
  Clear as ClearIcon,
  LocationOn as LocationIcon,
  Sort as SortIcon,
  Hotel as HotelIcon,
  Home as VillaIcon,
  Apartment as ApartmentIcon,
} from "@mui/icons-material";

const HomePage = () => {
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState("default");
  const [propertyTypeTab, setPropertyTypeTab] = useState(0); // 0: All, 1: Hotels, 2: Villas, 3: Apartments

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const allData = await hotelService.getAllHotels();

        if (!allData || allData.length === 0) {
          setAllProperties([]);
          setLoading(false);
          return;
        }

        // نحول البيانات لفورمات موحد
        const formatted = allData.map((item) => {
          let displayPrice = item.price;
          if (item.rooms && item.rooms.length > 0) {
            const roomPrices = item.rooms.map((r) => r.price);
            displayPrice = Math.min(...roomPrices);
          }

          return {
            image: item.images?.[0] || "https://via.placeholder.com/300x200?text=No+Image",
            title: item.name,
            rating: item.starRating || 4.5,
            price: `${displayPrice} ج.م / night`,
            numericPrice: displayPrice,
            id: item._id,
            model: "hotel",
            city: item.address?.city?.trim() || "Other",
            propertyType: item.propertyType || "hotel",
          };
        });

        // حساب أقصى سعر
        const allPrices = formatted.map((p) => p.numericPrice).filter((p) => p > 0);
        if (allPrices.length > 0) {
          const maxP = Math.max(...allPrices);
          const minP = Math.min(...allPrices);
          setMaxPrice(maxP);
          setPriceRange([minP, maxP]);
        }

        setAllProperties(formatted);
      } catch (err) {
        console.error("Error loading properties:", err);
        setError("Failed to load properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
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

  // استخراج كل المدن الفريدة
  const cities = ["All", ...new Set(allProperties.map((p) => p.city))];

  const getFilteredProperties = () => {
    // تحديد نوع العقار بناءً على الـ Tab
    const typeFilter = propertyTypeTab === 0 ? "all" 
                     : propertyTypeTab === 1 ? "hotel"
                     : propertyTypeTab === 2 ? "villa"
                     : "apartment";

    // نطبق كل الفلاتر
    let filtered = allProperties.filter((property) => {
      const matchesCity = selectedCity === "All" || property.city.toLowerCase() === selectedCity.toLowerCase();
      const matchesPrice = property.numericPrice >= priceRange[0] && property.numericPrice <= priceRange[1];
      const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || property.propertyType === typeFilter;

      return matchesCity && matchesPrice && matchesSearch && matchesType;
    });

    // نطبق الترتيب
    if (sortBy === "price_low") {
      filtered.sort((a, b) => a.numericPrice - b.numericPrice);
    } else if (sortBy === "price_high") {
      filtered.sort((a, b) => b.numericPrice - a.numericPrice);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    // نجمع حسب المدينة فقط
    const result = {};
    filtered.forEach((property) => {
      if (!result[property.city]) {
        result[property.city] = [];
      }
      result[property.city].push(property);
    });

    return result;
  };

  const filteredData = getFilteredProperties();

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

  const hasResults = Object.keys(filteredData).length > 0;

  const tabLabels = ["All", "Hotels", "Villas", "Apartments"];
  const tabIcons = [null, <HotelIcon />, <VillaIcon />, <ApartmentIcon />];

  return (
    <Box sx={{ pb: 6, minHeight: "100vh" }}>
      {/* PROPERTY TYPE TABS */}
      <Box
        sx={{
          position: "sticky",
          top: 64,
          zIndex: 101,
          bgcolor: "white",
          borderBottom: "2px solid #e0e0e0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <Box sx={{ px: { xs: 2, md: 6 } }}>
          <Tabs
            value={propertyTypeTab}
            onChange={(e, newValue) => setPropertyTypeTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                minHeight: 56,
                px: 3,
                color: "#666",
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#f27244",
                  bgcolor: "rgba(242, 114, 68, 0.04)",
                },
              },
              "& .Mui-selected": {
                color: "#f27244 !important",
                fontWeight: 700,
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#f27244",
                height: 3,
              },
            }}
          >
            {tabLabels.map((label, idx) => (
              <Tab
                key={idx}
                label={label}
                icon={tabIcons[idx]}
                iconPosition="start"
                sx={{ gap: 1 }}
              />
            ))}
          </Tabs>
        </Box>
      </Box>

      {/* FILTERS BAR */}
      <Box
        sx={{
          position: "sticky",
          top: 120,
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search properties..."
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
              {cities.map((city, index) => (
                <MenuItem key={index} value={city} sx={{ fontSize: "0.875rem" }}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </Button>

          <Divider orientation="vertical" flexItem />

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
                  "&:hover": { bgcolor: "#fff5f5", color: "#f27244" },
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
        {!hasResults ? (
          <Box sx={{ textAlign: "center", py: 8, px: 2 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No properties found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your filters or selecting a different property type
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
          <>
            {Object.keys(filteredData).map((city) => (
              <Box key={city} sx={{ mb: 3 }}>
                <PopularHomesCarousel
                  homes={filteredData[city]}
                  title={`Popular ${tabLabels[propertyTypeTab] === "All" ? "Properties" : tabLabels[propertyTypeTab]} in ${city}`}
                />
              </Box>
            ))}
          </>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;