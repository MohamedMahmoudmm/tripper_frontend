// components/detailsComponents/gridImages.jsx
import { Box, IconButton, Typography, CardMedia, Button, Rating } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlanIcon from "@mui/icons-material/EventNote";
import { useState, useEffect } from "react";
import favoriteService from "../../services/favorite.service";
import { useNavigate } from "react-router-dom";

export default function GridImages({ 
  images, 
  title, 
  itemId, 
  itemType = "Place",
  rating = 4.8,
  city = "Egypt",
  onCreatePlan 
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !itemId) return;

        const result = await favoriteService.checkFavorite(itemId, itemType);
        setIsFavorite(result.isFavorite);
      } catch (error) {
        console.error("Error checking favorite:", error);
      }
    };

    checkIfFavorite();
  }, [itemId, itemType]);

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      if (isFavorite) {
        await favoriteService.removeFavorite(itemId, itemType);
        setIsFavorite(false);
      } else {
        await favoriteService.addFavorite(itemId, itemType);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mb: 6 }}>
      {/* Title + Rating + Favorite */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography
            variant="h3"
            sx={{ 
              fontWeight: 800, 
              color: "#034959",
              fontSize: { xs: "2rem", md: "3rem" },
              letterSpacing: "-0.5px"
            }}
          >
            {title}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Rating value={rating} readOnly precision={0.1} />
              <Typography variant="h6" fontWeight="bold" color="#f27244">
                {rating}
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              {city}, Egypt
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Create Plan Button */}
          <Button
            variant="contained"
            size="large"
            startIcon={<PlanIcon />}
            onClick={onCreatePlan}
            sx={{
              backgroundColor: "#f27244",
              color: "white",
              px: 4,
              py: 1.5,
              borderRadius: 4,
              fontWeight: 700,
              fontSize: "1.1rem",
              boxShadow: "0 8px 25px rgba(242, 114, 68, 0.35)",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#d96135",
                transform: "translateY(-3px)",
                boxShadow: "0 12px 30px rgba(242, 114, 68, 0.45)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Create Travel Plan
          </Button>

          {/* Favorite Button */}
          <IconButton
            onClick={toggleFavorite}
            disabled={loading}
            sx={{
              border: "2px solid #f27244",
              borderRadius: "50%",
              backgroundColor: isFavorite ? "#f27244" : "#fff",
              width: 56,
              height: 56,
              "&:hover": { 
                backgroundColor: isFavorite ? "#d96135" : "#fff5f0",
                transform: "scale(1.1)"
              },
              transition: "all 0.3s ease",
            }}
          >
            {isFavorite ? (
              <FavoriteIcon sx={{ color: "white", fontSize: 28 }} />
            ) : (
              <FavoriteBorderIcon sx={{ color: "#f27244", fontSize: 28 }} />
            )}
          </IconButton>
        </Box>
      </Box>

      {/* Images Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gridTemplateRows: { xs: "300px 300px", sm: "auto" },
          gap: "8px",
          height: { xs: "600px", sm: "500px" },
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        }}
      >
        {/* Main Image */}
        <Box
          sx={{
            gridRow: { xs: "1", sm: "1 / span 2" },
            gridColumn: { xs: "1", sm: "1" },
            position: "relative",
            overflow: "hidden",
          }}
        >
          <CardMedia
            component="img"
            image={images?.[0] || "https://via.placeholder.com/800x600"}
            alt={title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.6s ease",
              "&:hover": { transform: "scale(1.05)" },
            }}
          />
        </Box>

        {/* Small Images Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: "8px",
          }}
        >
          {images?.slice(1, 5).map((img, index) => (
            <Box
              key={index}
              sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "12px",
              }}
            >
              <CardMedia
                component="img"
                image={img}
                alt={`${title} - ${index + 2}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.4s ease",
                  "&:hover": { transform: "scale(1.08)" },
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}