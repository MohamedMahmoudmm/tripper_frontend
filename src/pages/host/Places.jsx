import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Rating,
  Grid,
  useTheme,
  useMediaQuery,
  IconButton
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import axiosInstance from "../../axiousInstance/axoiusInstance";
import favoriteService from "../../services/favorite.service";
import { useNavigate } from "react-router-dom";

const Places = () => {
  const [favorites, setFavorites] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  // ✅ Fetch places
  useEffect(() => {
    axiosInstance.get("/places").then((res) => {
      setData(res.data.data);
    }).catch(err => {
      console.error("Failed to fetch places:", err);
    });
  }, []);

  // ✅ Check favorites for all places
  useEffect(() => {
    const checkAllFavorites = async () => {
      const token = localStorage.getItem("token");
      if (!token || data.length === 0) return;

      const favStatus = {};
      for (const place of data) {
        try {
          const result = await favoriteService.checkFavorite(place._id, "Place");
          favStatus[place._id] = result.isFavorite;
        } catch (error) {
          console.error(`Error checking favorite for ${place._id}:`, error);
        }
      }
      setFavorites(favStatus);
    };

    checkAllFavorites();
  }, [data]);

  // ✅ Toggle favorite
  const toggleFav = async (e, placeId) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add favorites");
      return;
    }

    if (loading[placeId]) return;

    setLoading(prev => ({ ...prev, [placeId]: true }));

    try {
      if (favorites[placeId]) {
        await favoriteService.removeFavorite(placeId, "Place");
        setFavorites(prev => ({ ...prev, [placeId]: false }));
      } else {
        await favoriteService.addFavorite(placeId, "Place");
        setFavorites(prev => ({ ...prev, [placeId]: true }));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert(error.message || "Error updating favorites");
    } finally {
      setLoading(prev => ({ ...prev, [placeId]: false }));
    }
  };

  const handleCardClick = (id) => {
    navigate(`/places/details/${id}`);
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

      <Grid container spacing={{ xs: 2, sm: 2, md: 2.5 }}>
        {data.map((place) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={4}
            key={place._id}
            sx={{ display: "flex", width: "30%", flexGrow: 0 }}
          >
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                flexGrow: 1,
                borderRadius: 2,
                boxShadow: 2,
                position: "relative",
                transition: "0.25s",
                cursor: "pointer",
                "&:hover": {
                  boxShadow: 4,
                  transform: "translateY(-4px)",
                },
              }}
              onClick={() => handleCardClick(place._id)}
            >
              {/* Favorite Button */}
              <IconButton
                onClick={(e) => toggleFav(e, place._id)}
                disabled={loading[place._id]}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 2,
                  bgcolor: "rgba(255,255,255,0.9)",
                  "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                }}
              >
                {favorites[place._id] ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>

              {/* Image */}
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 170, sm: 190, md: 210 }, 
                  minHeight: { xs: 170, sm: 190, md: 210 },
                  maxHeight: { xs: 170, sm: 190, md: 210 },
                  backgroundImage: `url(${place.images?.[0] || ""})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  bgcolor: place.images?.[0] ? "transparent" : "grey.200",
                }}
              />

              {/* Content */}
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  p: 2,
                }}
              >
                <Typography
                  fontWeight="bold"
                  fontSize={{ xs: "0.9rem", sm: "1rem" }}
                  mb={1}
                  sx={{
                    minHeight: "40px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {place.name}
                </Typography>

                <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                  <Rating
                    value={place.starRating}
                    readOnly
                    size="small"
                    precision={0.1}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {place.starRating}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mb: 2,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: "40px",
                  }}
                >
                  {place.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Places;