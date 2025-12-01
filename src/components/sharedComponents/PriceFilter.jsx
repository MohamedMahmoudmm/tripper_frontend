
import { Box, Typography, Slider } from "@mui/material";

export default function PriceFilter({ value, maxPrice, onChange }) {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        borderRadius: "8px",
        p: 2.5,
      }}
    >
      <Typography
        sx={{
          mb: 2,
          fontWeight: 600,
          textAlign: "center",
          color: "#333",
          fontSize: "0.95rem",
        }}
      >
        Price Range
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 1,
          px: 1,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, color: "#f27244" }}>
          {value[0]} ج.م
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: "#f27244" }}>
          {value[1]} ج.م
        </Typography>
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
          "& .MuiSlider-thumb": {
            width: 20,
            height: 20,
            "&:hover, &.Mui-focusVisible": {
              boxShadow: "0 0 0 8px rgba(242, 114, 68, 0.16)",
            },
          },
          "& .MuiSlider-track": {
            height: 6,
          },
          "& .MuiSlider-rail": {
            height: 6,
            opacity: 0.3,
          },
        }}
      />
    </Box>
  );
}