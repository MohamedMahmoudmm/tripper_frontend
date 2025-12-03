import React, { useEffect, useState } from "react";
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Chip,
  Stack,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WifiIcon from "@mui/icons-material/Wifi";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import PoolIcon from "@mui/icons-material/Pool";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import TvIcon from "@mui/icons-material/Tv";
import KitchenIcon from "@mui/icons-material/Kitchen";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import PetsIcon from "@mui/icons-material/Pets";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const amenityIcons = {
  "free wi-fi": <WifiIcon />,
  "air conditioning": <AcUnitIcon />,
  "swimming pool": <PoolIcon />,
  "parking": <LocalParkingIcon />,
  "tv": <TvIcon />,
  "kitchen": <KitchenIcon />,
  "washer": <LocalLaundryServiceIcon />,
  "pet friendly": <PetsIcon />,
  "breakfast included": <RestaurantIcon />,
  "24/7 support": <SupportAgentIcon />,
};

const AmenitiesForm = () => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const selectedAmenities = watch("amenities") || [];
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const defaultAmenities = [
      "Free Wi-Fi",
      "Air Conditioning",
      "Swimming Pool",
      "Parking",
      "TV",
      "Kitchen",
      "Washer",
      "Pet Friendly",
      "Breakfast Included",
      "24/7 Support",
    ];
    setAmenities(defaultAmenities.map((a) => a.toLowerCase()));
    setLoading(false);
  }, []);

  const handleChange = (amenity) => {
    const updated = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((a) => a !== amenity)
      : [...selectedAmenities, amenity];
    setValue("amenities", updated, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <Box data-error-section="amenities">
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h6" fontWeight="bold" color="#222">
            Amenities & Features
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Select all amenities available at your property
          </Typography>
        </Box>
        {selectedAmenities.length > 0 && (
          <Chip
            icon={<CheckCircleIcon />}
            label={`${selectedAmenities.length} selected`}
            sx={{
              backgroundColor: "#66BB6A",
              color: "#fff",
              fontWeight: 600,
            }}
          />
        )}
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" py={5}>
          <CircularProgress size={32} sx={{ color: "#667eea" }} />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 2,
            }}
          >
            {amenities.map((amenity) => {
              const isSelected = selectedAmenities.includes(amenity);
              const displayName = amenity.charAt(0).toUpperCase() + amenity.slice(1);
              const icon = amenityIcons[amenity];

              return (
                <Paper
                  key={amenity}
                  elevation={0}
                  onClick={() => handleChange(amenity)}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: isSelected
                      ? "2px solid #667eea"
                      : "2px solid #E0E0E0",
                    backgroundColor: isSelected ? "#F0F4FF" : "#fff",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#667eea",
                      backgroundColor: isSelected ? "#E8EEFF" : "#F5F5F5",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        backgroundColor: isSelected ? "#667eea" : "#F0F0F0",
                        color: isSelected ? "#fff" : "#666",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {icon || <CheckCircleIcon />}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        fontWeight={isSelected ? 600 : 500}
                        sx={{
                          color: isSelected ? "#667eea" : "#333",
                          fontSize: "0.9rem",
                          transition: "all 0.3s ease",
                        }}
                      >
                        {displayName}
                      </Typography>
                    </Box>
                    <Checkbox
                      checked={isSelected}
                      sx={{
                        color: "#E0E0E0",
                        "&.Mui-checked": {
                          color: "#667eea",
                        },
                      }}
                    />
                  </Stack>
                </Paper>
              );
            })}
          </Box>

          {errors.amenities && (
            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 2,
                backgroundColor: "#FFEBEE",
                border: "1px solid #FF385C",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <WarningAmberIcon sx={{ color: "#FF385C", fontSize: 20 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#FF385C",
                    fontWeight: 500,
                  }}
                >
                  {errors.amenities?.message || "Please select at least one amenity."}
                </Typography>
              </Stack>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
};

export default AmenitiesForm;