import { Box, IconButton, Typography, CardMedia } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export default function GridImages({ images, title }) {
  // الصورة الأساسية


  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Typography
          variant="h4"
          sx={{ flexGrow: 1, fontWeight: 700, color: "#034959" }}
        >
          {title}
        </Typography>
        <IconButton
          sx={{
            border: "1px solid #ccc",
            borderRadius: "50%",
            backgroundColor: "#fff",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          <FavoriteBorderIcon sx={{color:"#f27244"}}/>
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "repeat(2, 1fr)",
          gap: "6px",
          height: "420px",
          borderRadius: "16px",
          overflow: "hidden",
          mb: 5,
        }}
      >
        <Box
          sx={{
            gridRow: "1 / span 2",
            gridColumn: "1 / 2",
          }}
        >
          <CardMedia
            component="img"
            image={images?.[0]}
            alt="main"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: "6px",
          }}
        >
          {images?.slice(1, 5).map((img, index) => (
            <CardMedia
              key={index}
              component="img"
              image={img}
              alt={`small-${index}`}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
