import { Container, Typography, Box } from "@mui/material";

export default function FAQ() {
  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: { xs: 10, md: 16 } }}>
      <Container maxWidth="md">
        <Box textAlign="center">
          <Typography variant="h2" fontWeight="bold" sx={{ fontSize: { xs: "3rem", md: "4.5rem" } }}>
            Frequently Asked Questions
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mt: 4, maxWidth: 700, mx: "auto" }}>
            All the answers you need in one place.
          </Typography>
          <Typography variant="h3" sx={{ mt: 10, color: "#4a6cf7" }}>
            ← Check out our full Help Center above
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}