// Privacy.jsx
import { Container, Typography, Box } from "@mui/material";

export default function Privacy() {
  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: { xs: 10, md: 16 } }}>
      <Container maxWidth="md">
        <Box sx={{ bgcolor: "white", p: { xs: 8, md: 12 }, borderRadius: 6, boxShadow: "0 20px 50px rgba(0,0,0,0.1)" }}>
          <Typography variant="h2" fontWeight="bold" sx={{ mb: 6, color: "#0f172a" }}>
            Privacy Policy
          </Typography>
          <Typography paragraph sx={{ fontSize: "1.15rem", lineHeight: 2, color: "text.secondary" }}>
            At Tripper, your privacy is our top priority. We collect only what’s necessary to give you the best experience possible.
            We never sell your data. Ever.
          </Typography>
          <Typography variant="h5" sx={{ mt: 6, mb: 3, fontWeight: "bold" }}>What We Collect</Typography>
          <Typography paragraph color="text.secondary" sx={{ lineHeight: 2 }}>
            • Name & email (for account)<br/>
            • Location (optional, for better recommendations)<br/>
            • Booking history (to improve your experience)
          </Typography>
          <Typography variant="h5" sx={{ mt: 6, mb: 3, fontWeight: "bold" }}>How We Protect It</Typography>
          <Typography paragraph color="text.secondary" sx={{ lineHeight: 2 }}>
            Bank-level encryption • Regular security audits • GDPR & CCPA compliant
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 8, fontStyle: "italic" }}>
            Last updated: December 2025
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}