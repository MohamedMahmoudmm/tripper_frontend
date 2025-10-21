import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const HomeCard = ({ image, title, price, rating }) => {
  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        position: "relative",
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
        },
      }}
    >
      {/* Image Section */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="180"
          image={image}
          alt={title}
          sx={{ objectFit: "cover" }}
        />

        {/* Guest Favorite Chip */}
        <Chip
          label="Guest favorite"
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            backgroundColor: "white",
            fontWeight: "bold",
            fontSize: "12px",
          }}
        />

        {/* Heart Icon */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "rgba(255,255,255,0.8)",
            borderRadius: "50%",
            padding: "4px",
          }}
        >
          <FavoriteBorderIcon sx={{ fontSize: 22 }} />
        </Box>
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
          }}
        >
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: "gray" }}>
          {price}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#222", fontWeight: "bold", mt: 0.5 }}
        >
          ★ {rating}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default HomeCard;
