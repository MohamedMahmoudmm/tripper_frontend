import { Box, IconButton, Typography, CardMedia } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export default function GridImages({ image, title }) {
  // الصورة الأساسية
  const images = [
    image,
    "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    "https://images.unsplash.com/photo-1470770903676-69b98201ea1c",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Typography
          variant="h4"
          sx={{ flexGrow: 1, fontWeight: 700, color: "#1a1a3c" }}
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
          <FavoriteBorderIcon color="error" />
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
            image={images[0]}
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
          {images.slice(1, 5).map((img, index) => (
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
