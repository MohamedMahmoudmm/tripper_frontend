import React, { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import favoriteService from "../../services/favorite.service";

const HomeCard = ({ image, title, price, rating, model, id, onRemove }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  // Check if this card is already in favourites
  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !id || !model) return;

        const itemType =
          model === "experiance"
            ? "Experiance"
            : model === "hotel"
              ? "Hotel"
              : model === "place"
                ? "Place"
                : model;

        const result = await favoriteService.checkFavorite(id, itemType);
        setIsFavorite(result.isFavorite);
      } catch (error) {
        console.error("Error checking favorite:", error);
      }
    };

    checkIfFavorite();
  }, [id, model]);

  // Toggle favourite state
  const toggleFavorite = async (e) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      setSnackbar({
        open: true,
        message: "Please login to add favorites",
        severity: "warning",
      });
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const itemType =
        model === "experiance" || model === "Experiance" ? "Experiance" :
          model === "hotel" || model === "Hotel" ? "Hotel" :
            model === "place" || model === "Place" || model === "places" ? "Place" :
              model;

      if (isFavorite) {
        await favoriteService.removeFavorite(id, itemType);
        setIsFavorite(false);
        setSnackbar({
          open: true,
          message: "Removed from favorites",
          severity: "info",
        });

        // Call onRemove callback if provided
        if (onRemove) {
          onRemove(id);
        }
      } else {
        await favoriteService.addFavorite(id, itemType);
        setIsFavorite(true);
        setSnackbar({
          open: true,
          message: "Added to favorites",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setSnackbar({
        open: true,
        message: error.message || "Error updating favorites",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Navigate to details page
  const getDetailsRoute = (model, id) => {
    if (model === "place" || model === "places") {
      return `/places/details/${id}`;
    }
    if (model === "hotel") return `/hotel/details/${id}`;
    if (model === "experiance") return `/experiance/details/${id}`;
    return `/${model}/details/${id}`;
  };

  const handleCardClick = () => {
    navigate(getDetailsRoute(model, id));
  };

  return (
    <>
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
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
            }}
          />

          {/* Favourite Icon */}
          <IconButton
            onClick={toggleFavorite}
            disabled={loading}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(4px)",
              "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
              opacity: loading ? 0.6 : 1,
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
            <Typography
              variant="body2"
              sx={{ color: "gray", fontSize: "0.9rem" }}
            >
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={1000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default HomeCard;