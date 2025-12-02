// src/pages/About.jsx
import { Container, Typography, Box, Grid } from "@mui/material";

export default function About() {
  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: 10 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" fontWeight="bold" align="center" sx={{ mb: 4, color: "#1e293b" }}>
          About Tripper<span style={{ color: "#4a6cf7" }}>.</span>
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 8, maxWidth: 700, mx: "auto" }}>
          We connect travelers with authentic local experiences and unforgettable adventures.
        </Typography>

        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center", p: 4, bgcolor: "white", borderRadius: 3, boxShadow: 1 }}>
              <Typography variant="h3" sx={{ mb: 2 }}>Our Vision</Typography>
              <Typography color="text.secondary">
                To become the leading platform for discovering local experiences across the Arab world.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center", p: 4, bgcolor: "white", borderRadius: 3, boxShadow: 1 }}>
              <Typography variant="h3" sx={{ mb: 2 }}>Our Mission</Typography>
              <Typography color="text.secondary">
                Connecting people with unique, authentic, and joyful local experiences in a seamless way.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center", p: 4, bgcolor: "white", borderRadius: 3, boxShadow: 1 }}>
              <Typography variant="h3" sx={{ mb: 2 }}>Our Values</Typography>
              <Typography color="text.secondary">
                Quality, Innovation, Authenticity, and putting user experience first.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 10, p: 6, bgcolor: "white", borderRadius: 3, boxShadow: 1 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
            Our Story
          </Typography>
          <Typography paragraph color="text.secondary" sx={{ lineHeight: 2, fontSize: "1.1rem" }}>
            Tripper started with a simple idea: How can we make discovering local experiences easier and more enjoyable?
            We believe every city is full of hidden gems waiting to be discovered. Our platform combines modern technology with local knowledge to bring you the best recommendations.
          </Typography>
          <Typography paragraph color="text.secondary" sx={{ lineHeight: 2, fontSize: "1.1rem" }}>
            Today, we're proud to serve thousands of users, helping them create unforgettable memories every day.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}