import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Rating,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
  IconButton
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import axiosInstance from "../../axiousInstance/axoiusInstance";
import { useNavigate } from "react-router-dom";

const Places = () => {
  const [fav, setFav] = useState({});
  const [data, setData] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const toggleFav = (id) => {
    setFav((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    axiosInstance.get("/places").then((res) => {
      setData(res.data.data);
    }).catch(err => {
      console.error("Failed to fetch places:", err);
    });
  }, []);

  const handleCardClick = (id) => {
    navigate(`/places/details/${id}`);
  };

  return (
    <Container sx={{ py: { xs: 2, sm: 3 } }}>
      <Typography
        variant={isMobile ? "h6" : "h5"}
        fontWeight="bold"
        mb={{ xs: 2, sm: 3 }}
        textAlign={{ xs: "center", sm: "left" }}
      >
        Top Attractions in Egypt
      </Typography>

      {/* Cards Grid */}
      <Grid container spacing={{ xs: 2, sm: 2, md: 2.5 }}>
        {data.map((place) => (
          <Grid
  item
  xs={12}
  sm={6}
  md={4}
  lg={4}   // 3 كروت في الصف
  key={place._id}
  sx={{ display: "flex", width: "30%", flexGrow: 0 }}
>
  <Card
    sx={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      flexGrow: 1,
      borderRadius: 2,
      boxShadow: 2,
      position: "relative",
      transition: "0.25s",
      cursor: "pointer",
      "&:hover": {
        boxShadow: 4,
        transform: "translateY(-4px)",
      },
    }}
    onClick={() => handleCardClick(place._id)}
  >

    {/* Favorite Button */}
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        toggleFav(place._id);
      }}
      sx={{
        position: "absolute",
        top: 8,
        right: 8,
        zIndex: 2,
        bgcolor: "rgba(255,255,255,0.9)",
        "&:hover": { bgcolor: "rgba(255,255,255,1)" },
      }}
    >
      {fav[place._id] ? (
        <FavoriteIcon color="error" />
      ) : (
        <FavoriteBorderIcon />
      )}
    </IconButton>

    {/* FIXED IMAGE AREA – تمنع أي تمدد نهائي */}
    <Box
      sx={{
        width: "100%",
        height: { xs: 170, sm: 190, md: 210 }, 
        minHeight: { xs: 170, sm: 190, md: 210 },
        maxHeight: { xs: 170, sm: 190, md: 210 },
        backgroundImage: `url(${place.images?.[0] || ""})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        bgcolor: place.images?.[0] ? "transparent" : "grey.200",
      }}
    />


              {/* Content */}
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  p: 2,
                }}
              >
                {/* FIXED TITLE HEIGHT */}
                <Typography
                  fontWeight="bold"
                  fontSize={{ xs: "0.9rem", sm: "1rem" }}
                  mb={1}
                  sx={{
                    minHeight: "40px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {place.name}
                </Typography>

                <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                  <Rating
                    value={place.starRating}
                    readOnly
                    size="small"
                    precision={0.1}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {place.starRating}
                  </Typography>
                </Box>

                {/* FIXED DESCRIPTION HEIGHT */}
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mb: 2,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: "40px",
                  }}
                >
                  {place.description}
                </Typography>

                <Box mt="auto">
                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      bgcolor: "#f27244",
                      "&:hover": { bgcolor: "#034959" },
                      textTransform: "capitalize",
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Places;
