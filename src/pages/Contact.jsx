import { Container, Typography, Box, Grid, Button, Stack } from "@mui/material";
import { WhatsApp, Email, LocationOn } from "@mui/icons-material";

export default function Contact() {
  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: { xs: 10, md: 16 } }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={12}>
          <Typography variant="h2" fontWeight="bold" sx={{ fontSize: { xs: "3rem", md: "5rem" } }}>
            Let's Talk
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mt: 4 }}>
            We reply faster than your coffee gets cold
          </Typography>
        </Box>

        <Grid container spacing={8} alignItems="stretch">
          <Grid item xs={12} md={5}>
            <Box sx={{ bgcolor: "white", p: 8, borderRadius: 6, boxShadow: "0 20px 50px rgba(0,0,0,0.1)", height: "100%" }}>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 6, color: "#4a6cf7" }}>Get in Touch</Typography>
              <Stack spacing={6}>
                <Box display="flex" alignItems="center" gap={4}>
                  <Box sx={{ bgcolor: "#25d366", p: 3, borderRadius: 4, color: "white" }}><WhatsApp sx={{ fontSize: 40 }} /></Box>
                  <Box>
                    <Typography variant="h6">WhatsApp (Fastest)</Typography>
                    <Button variant="text" href="https://wa.me/201222339497" target="_blank" sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                      +20 122 233 9497
                    </Button>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={4}>
                  <Box sx={{ bgcolor: "#4a6cf7", p: 3, borderRadius: 4, color: "white" }}><Email sx={{ fontSize: 40 }} /></Box>
                  <Box>
                    <Typography variant="h6">Email</Typography>
                    <Typography fontWeight="bold" fontSize="1.2rem">support@tripper.com</Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={4}>
                  <Box sx={{ bgcolor: "#0f172a", p: 3, borderRadius: 4, color: "white" }}><LocationOn sx={{ fontSize: 40 }} /></Box>
                  <Box>
                    <Typography variant="h6">Office</Typography>
                    <Typography fontWeight="bold">New Cairo, Egypt</Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={7}>
            <Box sx={{ height: { xs: 400, md: 580 }, borderRadius: 6, overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.12)" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.5!2d31.45!3d30.02!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583f9f2b180001%3A0x7c8f8b7f8e8e8e8e!2sNew%20Cairo!5e0!3m2!1sen!2seg!4v1730000000000"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}