import { Container, Typography, Box, Grid } from "@mui/material";

export default function About() {
  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: { xs: 12, md: 20 } }}>
      <Container maxWidth="lg">

        {/* Hero */}
        <Box textAlign="center" mb={{ xs: 10, md: 16 }}>
          <Typography variant="h2" fontWeight="bold" sx={{ fontSize: { xs: "3rem", md: "5.5rem" }, color: "#0f172a" }}>
            We Are Tripper<span style={{ color: "#4a6cf7" }}>.</span>
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mt: 4, maxWidth: 900, mx: "auto", fontSize: "1.35rem", lineHeight: 1.8 }}>
            Connecting travelers with real people, real places, and real stories across the Arab world.
          </Typography>
        </Box>

        {/* Vision / Mission / Promise */}
        <Grid container spacing={{ xs: 6, md: 8 }} justifyContent="center" mb={{ xs: 12, md: 20 }}>
          {[
            { title: "Our Vision", text: "To be the #1 platform for authentic local discovery in every Arab city." },
            { title: "Our Mission", text: "Make every trip unforgettable by connecting people with passionate local hosts." },
            { title: "Our Promise", text: "100% verified experiences. Zero tourist traps. Pure authenticity." },
          ].map((item, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Box
                sx={{
                  textAlign: "center",
                  p: { xs: 6, md: 8 },
                  bgcolor: "white",
                  borderRadius: 6,
                  boxShadow: "0 25px 60px rgba(0,0,0,0.09)",
                  height: "100%",
                  transition: "all 0.4s ease",
                  "&:hover": {
                    transform: "translateY(-20px)",
                    boxShadow: "0 35px 80px rgba(74,108,247,0.2)",
                  },
                }}
              >
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: "#4a6cf7", fontSize: "2rem" }}>
                  {item.title}
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: "1.2rem", lineHeight: 2 }}>
                  {item.text}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Stats */}
        <Box sx={{ bgcolor: "white", p: { xs: 10, md: 14 }, borderRadius: 7, boxShadow: "0 30px 80px rgba(0,0,0,0.12)", textAlign: "center" }}>
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 10, color: "#0f172a" }}>
            Our Journey So Far
          </Typography>
          <Grid container spacing={{ xs: 8, md: 12 }} justifyContent="center">
            {[
              { num: "50K+", label: "Happy Travelers" },
              { num: "1,200+", label: "Unique Experiences" },
              { num: "18", label: "Cities Covered" },
              { num: "4.9★", label: "Average Rating" },
            ].map((stat, i) => (
              <Grid item xs={6} sm={3} key={i}>
                <Box>
                  <Typography variant="h2" fontWeight="bold" sx={{ color: "#4a6cf7", fontSize: { xs: "3rem", md: "4rem" } }}>
                    {stat.num}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 2, fontSize: "1.1rem" }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}