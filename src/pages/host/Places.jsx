import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Button,
  Link,
  IconButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const Places = () => {
  const [fav, setFav] = useState({});
  const toggleFav = (id) => setFav((p) => ({ ...p, [id]: !p[id] }));

  const data = [
    {
      id: 1,
      name: "Pyramids of Giza",
      rate: 4.6,
      rev: "9,144",
      type: "Historic Sites",
      price: "$20",
      desc: "Among the Seven Wonders of the World, the pyramids remain a mystery of ancient engineering.",
      exp: "5,517",
      img: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      name: "Egyptian Museum",
      rate: 4.5,
      rev: "13,306",
      type: "Museums",
      price: "$28",
      desc: "Home to the world’s largest ancient Egyptian artifact collection including Tutankhamun treasures.",
      exp: "2,796",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      name: "Valley of the Kings",
      rate: 4.7,
      rev: "7,054",
      type: "Ancient Ruins",
      price: "$27",
      desc: "A desert valley housing the royal tombs of pharaohs — including Tutankhamun.",
      exp: "4,427",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <Container sx={{ py: 3 }}>
      {/* 🔹 زرار Sell All */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(45deg,#6a11cb,#2575fc)",
            px: 3,
            borderRadius: "25px",
            textTransform: "capitalize",
            fontWeight: "bold",
          }}
        >
          Sell All
        </Button>
      </Box>

      <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
        Top Attractions in Egypt
      </Typography>

      {/* 🔹 الكروت */}
      <Box display="flex" justifyContent="space-between" gap={3}>
        {data.map((a) => (
          <Card
            key={a.id}
            sx={{
              flex: 1,
              borderRadius: 3,
              boxShadow: 3,
              position: "relative",
              "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
              transition: ".3s",
            }}
          >
            <IconButton
              onClick={() => toggleFav(a.id)}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "rgba(255,255,255,0.8)",
              }}
            >
              {fav[a.id] ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </IconButton>

            <CardMedia component="img" height="320" image={a.img} alt={a.name} />
            <CardContent>
              <Typography fontWeight="bold">{a.name}</Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Rating value={a.rate} readOnly size="small" precision={0.1} />
                <Typography variant="body2">{a.rate} ({a.rev})</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {a.type} • From {a.price}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {a.desc}
              </Typography>
              <Box mt={1} display="flex" justifyContent="space-between">
                <Link sx={{ fontSize: ".8rem" }}>Experience ({a.exp})</Link>
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    bgcolor: "#ff6b6b",
                    "&:hover": { bgcolor: "#ff5252" },
                    textTransform: "capitalize",
                  }}
                >
                  Book
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* 🔹 زرار Ask Offline */}
      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button
          variant="outlined"
          sx={{
            borderColor: "#2575fc",
            color: "#2575fc",
            borderRadius: "25px",
            px: 3,
            textTransform: "capitalize",
            "&:hover": { bgcolor: "#2575fc", color: "#fff" },
          }}
        >
          Ask Offline
        </Button>
      </Box>
    </Container>
  );
};

export default Places;
