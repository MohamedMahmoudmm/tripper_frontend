import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
  Chip,
  IconButton,
  alpha,
} from "@mui/material";
import {
  Edit,
  Delete,
  LocationOn,
  AttachMoney,
  Star,
  Hotel as HotelIcon,
  People,
} from "@mui/icons-material";

const ListingCard = ({ listing, onEdit, onDelete, type }) => {
  // type should be 'hotel' or 'experience'
  // const isHotel = type === 'hotel';
  const isHotel = listing.propertyType === "hotel";

  
  // Get minimum price
  const minPrice = isHotel && listing.rooms && listing.rooms.length > 0
    ? Math.min(...listing.rooms.map((r) => r.price))
    : listing.price || 0;

  // Get image URL
  const imageUrl = listing.images?.[0] || listing.image || "/placeholder-hotel.jpg";

  return (
    <Card
      sx={{
        borderRadius: "16px",
        overflow: "hidden",
        transition: "all 0.3s ease",
        border: "1px solid #e0e0e0",
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
          "& .action-buttons": {
            opacity: 1,
          },
        },
      }}
    >
      {/* Image Section */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="220"
          image={imageUrl}
          alt={listing.name}
          sx={{
            objectFit: "cover",
            bgcolor: "#f5f5f5",
          }}
        />
        
        {/* Action Buttons Overlay */}
        <Box
          className="action-buttons"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            gap: 1,
            opacity: 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <IconButton
            onClick={onEdit}
            sx={{
              bgcolor: "white",
              boxShadow: 2,
              "&:hover": {
                bgcolor: "#FF385C",
                color: "white",
              },
            }}
            size="small"
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            onClick={onDelete}
            sx={{
              bgcolor: "white",
              boxShadow: 2,
              "&:hover": {
                bgcolor: "#d32f2f",
                color: "white",
              },
            }}
            size="small"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>

        {/* Type Badge */}
        <Chip
          label={(listing?.propertyType || "Experience").toUpperCase()}
          size="small"
          sx={{
            position: "absolute",
            bottom: 12,
            left: 12,
            bgcolor: "white",
            fontWeight: 600,
            boxShadow: 1,
          }}
        />
      </Box>

      {/* Content Section */}
      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.3,
            minHeight: "2.6em",
          }}
        >
          {listing.name}
        </Typography>

        {/* Location */}
        {listing.address?.city && (
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5, gap: 0.5 }}>
            <LocationOn sx={{ fontSize: 18, color: "#717171" }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {listing.address.city}
              {listing.address.country && `, ${listing.address.country}`}
            </Typography>
          </Box>
        )}

        {/* Hotel-specific info */}
        {isHotel && (
          <Box sx={{ display: "flex", gap: 2, mb: 1.5 }}>
            {listing.rooms?.length > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <HotelIcon sx={{ fontSize: 18, color: "#717171" }} />
                <Typography variant="body2" color="text.secondary">
                  {listing.rooms.length} Rooms
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Experience-specific info */}
        {!isHotel && listing.maxGuests && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}>
            <People sx={{ fontSize: 18, color: "#717171" }} />
            <Typography variant="body2" color="text.secondary">
              Up to {listing.maxGuests} guests
            </Typography>
          </Box>
        )}

        {/* Rating */}
        {listing.rating > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}>
            <Star sx={{ fontSize: 18, color: "#FFB400" }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {listing.rating.toFixed(1)}
            </Typography>
            {listing.reviewCount && (
              <Typography variant="body2" color="text.secondary">
                ({listing.reviewCount} reviews)
              </Typography>
            )}
          </Box>
        )}

        {/* Price */}
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            gap: 0.5,
            mt: "auto",
            pt: 1.5,
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#FF385C",
            }}
          >
            ${minPrice}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            / {isHotel ? "night" : "person"}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ListingCard;