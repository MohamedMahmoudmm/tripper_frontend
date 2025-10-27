import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Button,
  IconButton,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import axiosInstance from "../../axiousInstance/axoiusInstance";

const Places = () => {
  const [fav, setFav] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [autoPlay, setAutoPlay] = useState({});

  const toggleFav = (id) => setFav((p) => ({ ...p, [id]: !p[id] }));

  const [data, setData] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    axiosInstance.get("/places").then((res) => {
      console.log(res.data.data);
      setData(res.data.data);
      
      // Initialize image indices
      const initialIndices = {};
      const initialAutoPlay = {};
      res.data.data.forEach(item => {
        initialIndices[item._id] = 0;
        initialAutoPlay[item._id] = null;
      });
      setCurrentImageIndex(initialIndices);
      setAutoPlay(initialAutoPlay);
    });
  }, []);

  const handleMouseEnter = (id) => {
    if (!isMobile) {
      setHoveredCard(id);
      // Start auto-play when hovering
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => ({
          ...prev,
          [id]: (prev[id] + 1) % (data.find(item => item._id === id)?.images.length || 1)
        }));
      }, 2000); // Change image every 2 seconds
      setAutoPlay(prev => ({ ...prev, [id]: interval }));
    }
  };

  const handleMouseLeave = (id) => {
    setHoveredCard(null);
    // Clear auto-play interval when not hovering
    if (autoPlay[id]) {
      clearInterval(autoPlay[id]);
      setAutoPlay(prev => ({ ...prev, [id]: null }));
    }
  };

  const nextImage = (id, event) => {
    event.stopPropagation();
    const item = data.find(item => item._id === id);
    if (item) {
      setCurrentImageIndex(prev => ({
        ...prev,
        [id]: (prev[id] + 1) % item.images.length
      }));
    }
  };

  const prevImage = (id, event) => {
    event.stopPropagation();
    const item = data.find(item => item._id === id);
    if (item) {
      setCurrentImageIndex(prev => ({
        ...prev,
        [id]: prev[id] === 0 ? item.images.length - 1 : prev[id] - 1
      }));
    }
  };

  const goToImage = (id, index) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [id]: index
    }));
  };

  useEffect(() => {
    // Cleanup intervals on unmount
    return () => {
      Object.values(autoPlay).forEach(interval => {
        if (interval) clearInterval(interval);
      });
    };
  }, [autoPlay]);

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

      {/* 🔹 Responsive Grid for Cards - 4 cards per row on desktop */}
      <Grid container spacing={{ xs: 2, sm: 2, md: 2.5 }}>
        {data.map((a) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={a._id}
            sx={{
              display: "flex",
              "& .MuiCard-root": {
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
              },
            }}
          >
            <Card
              sx={{
                borderRadius: { xs: 2, sm: 2 },
                boxShadow: { xs: 1, sm: 2 },
                position: "relative",
                "&:hover": {
                  transform: { xs: "none", sm: "translateY(-3px)" },
                  boxShadow: { xs: 1, sm: 4 },
                },
                transition: "all 0.3s ease",
                maxWidth: "100%",
                overflow: "visible",
              }}
              onMouseEnter={() => handleMouseEnter(a._id)}
              onMouseLeave={() => handleMouseLeave(a._id)}
            >
              {/* Favorite Icon */}
              <IconButton
                onClick={() => toggleFav(a._id)}
                sx={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  bgcolor: "rgba(255,255,255,0.9)",
                  zIndex: 3,
                  width: { xs: 28, sm: 32 },
                  height: { xs: 28, sm: 32 },
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,1)",
                  },
                }}
              >
                {fav[a._id] ? (
                  <FavoriteIcon 
                    color="error" 
                    sx={{ fontSize: { xs: 18, sm: 20 } }} 
                  />
                ) : (
                  <FavoriteBorderIcon 
                    sx={{ fontSize: { xs: 18, sm: 20 } }} 
                  />
                )}
              </IconButton>

              {/* Image Carousel */}
              <Box sx={{ position: "relative", overflow: "hidden" }}>
                <CardMedia
                  component="img"
                  height={isMobile ? "160" : isTablet ? "180" : "200"}
                  image={a.images[currentImageIndex[a._id] || 0]}
                  alt={a.name}
                  sx={{
                    objectFit: "cover",
                    transition: "opacity 0.3s ease",
                  }}
                />

                {/* Navigation Arrows - Show on hover */}
                {hoveredCard === a._id && a.images.length > 1 && (
                  <>
                    <IconButton
                      onClick={(e) => prevImage(a._id, e)}
                      sx={{
                        position: "absolute",
                        left: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        bgcolor: "rgba(255,255,255,0.9)",
                        zIndex: 2,
                        width: 32,
                        height: 32,
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,1)",
                        },
                      }}
                    >
                      <NavigateBeforeIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={(e) => nextImage(a._id, e)}
                      sx={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        bgcolor: "rgba(255,255,255,0.9)",
                        zIndex: 2,
                        width: 32,
                        height: 32,
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,1)",
                        },
                      }}
                    >
                      <NavigateNextIcon fontSize="small" />
                    </IconButton>
                  </>
                )}

                {/* Image Indicators/Dots */}
                {a.images.length > 1 && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      gap: 0.5,
                      zIndex: 2,
                    }}
                  >
                    {a.images.map((_, index) => (
                      <Box
                        key={index}
                        onClick={() => goToImage(a._id, index)}
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: index === (currentImageIndex[a._id] || 0) 
                            ? "white" 
                            : "rgba(255,255,255,0.5)",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            bgcolor: "white",
                            transform: "scale(1.2)",
                          },
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>

              <CardContent sx={{ 
                flexGrow: 1, 
                p: { xs: 1.5, sm: 1.5 },
                '&:last-child': { pb: { xs: 1.5, sm: 1.5 } }
              }}>
                <Typography
                  fontWeight="bold"
                  fontSize={{ xs: "0.85rem", sm: "0.9rem" }}
                  mb={0.5}
                  lineHeight={1.2}
                >
                  {a.name}
                </Typography>
                <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                  <Rating
                    value={a.starRating}
                    readOnly
                    size={isMobile ? "small" : "small"}
                    precision={0.1}
                    sx={{ fontSize: { xs: 16, sm: 18 } }}
                  />
                  <Typography 
                    variant="body2" 
                    fontSize={{ xs: "0.7rem", sm: "0.75rem" }}
                    color="text.secondary"
                  >
                    {a.starRating}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    lineHeight: 1.3,
                    color: "text.secondary",
                    mb: 1.5,
                  }}
                >
                  {a.description}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      bgcolor: "#f27244",
                      "&:hover": { bgcolor: "#034959" },
                      textTransform: "capitalize",
                      fontSize: { xs: "0.7rem", sm: "0.75rem" },
                      px: { xs: 1.5, sm: 2 },
                      py: { xs: 0.5, sm: 0.75 },
                      minWidth: "auto",
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 🔹 Responsive Ask Offline Button */}
     
    </Container>
  );
};

export default Places;