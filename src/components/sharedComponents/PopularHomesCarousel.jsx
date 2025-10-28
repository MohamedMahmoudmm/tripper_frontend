import React, { useRef, useState, useEffect } from "react";
import { Box, Typography, IconButton, useMediaQuery, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import HomeCard from "./HomeCard";
import SearchBarFields from "./SearchBarFields";

const PopularHomesCarousel = ({ homes = [], title = "Popular Homes in Cairo" }) => {
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
      const scrollAmount = current.clientWidth * 0.9;
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
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* Search Bar */}
      <Paper
        elevation={3}
        sx={{
          width: { xs: "95%", sm: "85%", md: "70%" },
          maxWidth: "900px",
          mx: "auto",
          mt: { xs: 2, md: 3 },
          mb: { xs: 2, md: 4 },
          borderRadius: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <SearchBarFields />
      </Paper>

      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{
          mb: 2,
          textAlign: { xs: "center", md: "left" },
          px: { xs: 1, md: 3 },
        }}
      >
        {title}
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
          p:2,
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
