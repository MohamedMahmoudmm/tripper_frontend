import {Typography, Box,Grid,Card,CardMedia,CardContent} from "@mui/material";

export default function TopPlacesSection() {
     const topPlaces = [
        {
          img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
          title: "Santorini, Greece",
          location: "Greece, Europe",
          price: "$980 / person",
        },
        {
          img: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff",
          title: "Bali, Indonesia",
          location: "Indonesia, Asia",
          price: "$850 / person",
        },
        {
          img: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba",
          title: "Swiss Alps, Switzerland",
          location: "Switzerland, Europe",
          price: "$1100 / person",
        },
      ];
    
    return (
        <Box sx={{ textAlign: "center", py: 10, backgroundColor: "#f9f9f9" }}>
        <Typography
          variant="subtitle2"
          sx={{
            textTransform: "uppercase",
            color: "#5E6282",
            fontWeight: 600,
            letterSpacing: 2,
            mb: 1,
          }}
        >
          Top Places
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "#14183E",
            mb: 6,
          }}
        >
          Explore Our Most Popular Destinations
        </Typography>

        <Grid container spacing={5} justifyContent="center">
          {topPlaces.map((place, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  borderRadius: "20px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  transition: "transform 0.3s ease",
                  cursor: "pointer",
                  "&:hover": { transform: "translateY(-8px)" },
                }}
              >
                <CardMedia
                  component="img"
                  height="220"
                  image={place.img}
                  alt={place.title}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#14183E" }}>
                    {place.title}
                  </Typography>
                  <Typography variant="body2" color="#5E6282">
                    {place.location}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#14183E", mt: 1 }}>
                    {place.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    )
}