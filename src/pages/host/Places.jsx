import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  useTheme,
  useMediaQuery,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axiosInstance from "../../axiousInstance/axoiusInstance";
import HomeCard from "../../components/sharedComponents/HomeCard";

const Places = () => {
  const [data, setData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


  useEffect(() => {
    axiosInstance.get("/places").then((res) => {
      setData(res.data.data);
      // عشان نشوف structure الـ data
      console.log("Places Data:", res.data.data);
      if (res.data.data.length > 0) {
        console.log("First Place:", res.data.data[0]);
      }
    }).catch(err => {
      console.error("Failed to fetch places:", err);
    });
  }, []);

  // Get unique places/cities from data - جرب properties مختلفة
  const cities = [
    "All", 
    ...new Set(
      data.map(place => 
        place.location?.city || 
        place.address?.city || 
        place.city || 
        place.place || 
        place.location
      ).filter(Boolean)
    )
  ];

  console.log("Available Cities:", cities);

  // Filter by city and search query
  const filteredData = data.filter(place => {
    // جرب properties مختلفة للمدينة
    const placeCity = place.location?.city || 
                      place.address?.city || 
                      place.city || 
                      place.place || 
                      place.location;
    
    const cityMatch = selectedCity === "All" || placeCity === selectedCity;
    const searchMatch = !searchQuery || 
      (place.name && place.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (place.description && place.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return cityMatch && searchMatch;
  });

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };


  return (
    <Container sx={{ py: { xs: 2, sm: 3 } }}>
      <Typography
        variant={isMobile ? "h6" : "h5"}
        fontWeight="bold"
        mb={{ xs: 2, sm: 3 }}
        textAlign={{ xs: "center", sm: "left" }}
      >
        Top Attractions in Egypt
      </Typography>

      {/* Search and Filter Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "center",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 4,
        }}
      >
        {/* Search Bar */}
        <TextField
          placeholder="Search places..."
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{
            width: { xs: "100%", sm: "350px" },
            backgroundColor: "white",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "&:hover fieldset": {
                borderColor: "#f27244",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#f27244",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#034959" }} />
              </InputAdornment>
            ),
          }}
        />

        {/* City Filter */}
        <FormControl
          sx={{
            width: { xs: "100%", sm: "250px" },
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
            onChange={handleCityChange}
            sx={{
              borderRadius: "8px",
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

      {/* Cards Grid */}
      <Grid container spacing={{ xs: 2, sm: 2, md: 2.5 }}>
      {currentData.map((place) => (
  <Grid item xs={12} sm={6} md={4} key={place._id}>
 <HomeCard
  id={place._id}
  image={place.images?.[0]}
  title={place.name}
  price="View Details"
  rating={place.starRating || 0}
model="place"
/>
  </Grid>
))}

      </Grid>

        {filteredData.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No places found{searchQuery && ` matching "${searchQuery}"`}
            {selectedCity !== "All" && ` in ${selectedCity}`}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Places;