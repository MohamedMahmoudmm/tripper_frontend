import { Container, Typography, Box, Stack, Link, Button, Grid } from "@mui/material";
import { Phone, Email, WhatsApp } from "@mui/icons-material";

export default function Contact() {
  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: 10 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" fontWeight="bold" align="center" sx={{ mb: 3 }}>
          Get in Touch
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 8 }}>
          We'd love to hear from you! Reach out through any of the methods below.
        </Typography>

        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Box sx={{ bgcolor: "white", p: 5, borderRadius: 3, boxShadow: 2, height: "100%" }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>Contact Information</Typography>
              <Stack spacing={4}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Phone sx={{ color: "#4a6cf7" }} />
                  <Box>
                    <Typography color="text.secondary">Phone</Typography>
                    <Link href="tel:+201234567890" color="inherit" fontWeight="bold">+20 123 456 7890</Link>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <Email sx={{ color: "#4a6cf7" }} />
                  <Box>
                    <Typography color="text.secondary">Email</Typography>
                    <Link href="mailto:support@tripper.com" color="inherit" fontWeight="bold">support@tripper.com</Link>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <WhatsApp sx={{ color: "#25d366" }} />
                  <Button href="https://wa.me/201234567890" target="_blank" variant="outlined">
                    Chat on WhatsApp
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ height: 400, borderRadius: 3, overflow: "hidden", boxShadow: 2 }}>
              <iframe
                title="Tripper Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.484!2d31.2357!3d30.0444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145841e2a5e5e5e5%3A0x5e5e5e5e5e5e5e5!2sCairo%2C%20Egypt!5e0!3m2!1sen!2seg!4v1698000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}