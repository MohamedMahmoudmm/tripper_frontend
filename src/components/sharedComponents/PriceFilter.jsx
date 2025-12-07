import { Box, Typography, Slider, Popover, Button } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useState } from "react";

export default function PriceFilter({ value, maxPrice, onChange }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        onClick={handleClick}
        size="small"
        startIcon={<AttachMoneyIcon sx={{ fontSize: 18 }} />}
        sx={{
          color: "#666",
          textTransform: "none",
          fontSize: "0.875rem",
          fontWeight: 500,
          px: 1.5,
          py: 0.75,
          minWidth: "auto",
          "&:hover": {
            bgcolor: "#f5f5f5",
          },
        }}
      >
        Price
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            width: 280,
            p: 2.5,
          },
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
          Price Range
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: "#999", fontSize: "0.7rem" }}>
              Min
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#f27244" }}>
              {value[0]} ج.م
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: "#999", fontSize: "0.7rem" }}>
              Max
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#f27244" }}>
              {value[1]} ج.م
            </Typography>
          </Box>
        </Box>

        <Slider
          value={value}
          onChange={(e, newValue) => onChange(newValue)}
          valueLabelDisplay="auto"
          min={0}
          max={maxPrice}
          step={50}
          sx={{
            color: "#f27244",
            height: 4,
            "& .MuiSlider-thumb": {
              width: 16,
              height: 16,
            },
            "& .MuiSlider-track": {
              height: 4,
            },
            "& .MuiSlider-rail": {
              height: 4,
              opacity: 0.3,
            },
          }}
        />
      </Popover>
    </>
  );
}