import React, { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";

const HomeCard = ({ image, title, price, rating,model, id }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  // ✅ Check if this card is already in favourites
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const exists = favorites.some((item) => item.title === title);
    setIsFavorite(exists);
  }, [title]);

  // ✅ Toggle favourite state and update localStorage
  const toggleFavorite = (e) => {
    e.stopPropagation(); // مهم عشان ما يدخلش صفحة التفاصيل لما ندوس على القلب

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (isFavorite) {
      favorites = favorites.filter((item) => item.title !== title);
      setIsFavorite(false);
    } else {
      favorites.push({ image, title, price, rating });
      setIsFavorite(true);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  // ✅ Navigate to details page with data
  const handleCardClick = () => {
    localStorage.setItem(
      "selectedPlace",
      JSON.stringify({ image, title, price, rating })
    );
    navigate(`/${model}/details/${id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        width: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* Image Section */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="200"
          image={image}
          alt={title}
          sx={{
            objectFit: "cover",
            transition: "transform 0.3s ease",
            "&:hover": { transform: "scale(1.03)" },
          }}
        />

       

        {/* Favourite Icon */}
        <IconButton
          onClick={toggleFavorite}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(255,255,255,0.9)",
            "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
          }}
        >
          {isFavorite ? (
            <FavoriteIcon sx={{ color: "#FF385C", fontSize: 22 }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: "#333", fontSize: 22 }} />
          )}
        </IconButton>
      </Box>

      {/* Text Section */}
      <CardContent sx={{ p: 2 }}>
        <Typography
          fontWeight="bold"
          sx={{
            mb: 0.5,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "1rem",
          }}
        >
          {title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 0.5,
          }}
        >
          <Typography variant="body2" sx={{ color: "gray", fontSize: "0.9rem" }}>
            {price}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <StarIcon sx={{ color: "#FFB400", fontSize: 18 }} />
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "#222", fontSize: "0.9rem" }}
            >
              {rating}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HomeCard;
