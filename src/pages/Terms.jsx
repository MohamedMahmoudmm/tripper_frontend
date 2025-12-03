// Terms.jsx
import { Container, Typography, Box } from "@mui/material";

export default function Terms() {
  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: { xs: 10, md: 16 } }}>
      <Container maxWidth="md">
        <Box sx={{ bgcolor: "white", p: { xs: 8, md: 12 }, borderRadius: 6, boxShadow: "0 20px 50px rgba(0,0,0,0.1)" }}>
          <Typography variant="h2" fontWeight="bold" sx={{ mb: 6 }}>
            Terms of Service
          </Typography>
          <Typography paragraph sx={{ fontSize: "1.15rem", lineHeight: 2, color: "text.secondary" }}>
            Welcome to Tripper! By using our platform, you agree to be respectful, honest, and kind — both to hosts and fellow travelers.
            Simple as that.
          </Typography>
          <Typography variant="h5" sx={{ mt: 6, fontWeight: "bold" }}>Key Rules</Typography>
          <Typography paragraph color="text.secondary" sx={{ lineHeight: 2 }}>
            • Be on time<br/>
            • No-shows may result in fees<br/>
            • Treat hosts and locations with respect<br/>
            • Leave reviews honestly
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 8, fontStyle: "italic" }}>
            Updated: December 2025
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}