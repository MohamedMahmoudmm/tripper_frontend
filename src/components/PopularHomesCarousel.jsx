import React, { useRef, useState, useEffect } from "react";
import { Box, Typography, IconButton, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import HomeCard from "./HomeCard";

const homes = [
  {
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60",
    title: "Apartment in El Maadi",
    price: "4,774 ج.م / 2 nights",
    rating: 4.93,
  },
  {
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=60",
    title: "Apartment in Giza",
    price: "6,184 ج.م / 2 nights",
    rating: 5.0,
  },
  {
    image:
      "https://images.unsplash.com/photo-1600585154217-8a9a99a6a53e?auto=format&fit=crop&w=800&q=60",
    title: "Apartment in Downtown",
    price: "1,997 ج.م / 2 nights",
    rating: 4.87,
  },
  {
    image:
      "https://images.unsplash.com/photo-1586105251261-72a756497a12?auto=format&fit=crop&w=800&q=60",
    title: "Room in Nasr City",
    price: "1,845 ج.م / 2 nights",
    rating: 4.98,
  },
  {
    image:
      "https://images.unsplash.com/photo-1600585154780-0c77d90d1b1c?auto=format&fit=crop&w=800&q=60",
    title: "Apartment in Bab El Louk",
    price: "13,833 ج.م / 2 nights",
    rating: 4.96,
  },
];

const PopularHomesCarousel = () => {
  const scrollRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const handleScroll = () => {
    const { current } = scrollRef;
    if (current) {
      const tolerance = 30;
      const scrollLeft = current.scrollLeft;
      const maxScroll = current.scrollWidth - current.clientWidth;

      setShowLeft(scrollLeft > tolerance);
      setShowRight(scrollLeft < maxScroll - tolerance);
    }
  };

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = current.clientWidth * 0.9; // smoother scroll
      const newScroll =
        direction === "left"
          ? current.scrollLeft - scrollAmount
          : current.scrollLeft + scrollAmount;
      current.scrollTo({ left: newScroll, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", handleScroll);
      handleScroll();
    }
    return () => ref && ref.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 6 },
        py: 4,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ mb: 2, textAlign: { xs: "center", md: "left" } }}
      >
        Popular homes in Cairo
      </Typography>

      {/* Left Arrow */}
      {showLeft && (
        <IconButton
          onClick={() => scroll("left")}
          sx={{
            position: "absolute",
            top: "50%",
            left: { xs: 0, sm: 10 },
            transform: "translateY(-50%)",
            zIndex: 3,
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            "&:hover": { backgroundColor: "#f5f5f5" },
            width: { xs: 30, sm: 40 },
            height: { xs: 30, sm: 40 },
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
        </IconButton>
      )}

      {/* Right Arrow */}
      {showRight && (
        <IconButton
          onClick={() => scroll("right")}
          sx={{
            position: "absolute",
            top: "50%",
            right: { xs: 0, sm: 10 },
            transform: "translateY(-50%)",
            zIndex: 3,
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            "&:hover": { backgroundColor: "#f5f5f5" },
            width: { xs: 30, sm: 40 },
            height: { xs: 30, sm: 40 },
          }}
        >
          <ArrowForwardIosIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
        </IconButton>
      )}

      {/* Cards Container */}
      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          scrollBehavior: "smooth",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {homes.map((home, i) => (
          <Box
            key={i}
            sx={{
              flex: "0 0 auto",
              scrollSnapAlign: "start",
              width: isMobile ? "90%" : isTablet ? "45%" : "23%",
              transition: "transform 0.3s ease",
              "&:hover": { transform: !isMobile && "scale(1.03)" },
            }}
          >
            <HomeCard {...home} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PopularHomesCarousel;
