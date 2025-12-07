import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Facebook,
  Instagram,
  Twitter,
  WhatsApp,
  Phone,
  Email as EmailIcon,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  const socialLinks = {
    facebook: "https://facebook.com/zoom.hazem.9237",
    instagram: "https://instagram.com/omar_hocam",
    twitter: "https://x.com/Omar_hocam",
    whatsapp: "https://wa.me/201222339497",
  };

  return (
    <Box sx={{ bgcolor: "#0f172a", color: "white", pt: { xs: 10, md: 16 }, pb: 10 }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 6, md: 8 }}>

          {/* Brand & Description */}
          <Grid item xs={12} md={4}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, letterSpacing: "-0.5px" }}>
              Tripper<span style={{ color: "#4a6cf7" }}>.</span>
            </Typography>

            <Typography
              variant="body1"
              color="grey.400"
              sx={{ lineHeight: 1.9, mb: 5, fontSize: "1.05rem", maxWidth: 380 }}
            >
              Discover authentic local experiences, hidden gems, and unforgettable adventures across the Arab world.
            </Typography>

            <Stack direction="row" spacing={2}>
              <IconButton href={socialLinks.facebook} target="_blank" aria-label="Facebook"
                sx={{ bgcolor: "#1877f2", "&:hover": { bgcolor: "#145dbf", transform: "scale(1.15)" }, transition: "0.3s" }}>
                <Facebook />
              </IconButton>
              <IconButton href={socialLinks.instagram} target="_blank" aria-label="Instagram"
                sx={{ background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", "&:hover": { transform: "scale(1.15)" }, transition: "0.3s" }}>
                <Instagram />
              </IconButton>
              <IconButton href={socialLinks.twitter} target="_blank" aria-label="Twitter"
                sx={{ bgcolor: "#1da1f2", "&:hover": { bgcolor: "#0d8bd9", transform: "scale(1.15)" }, transition: "0.3s" }}>
                <Twitter />
              </IconButton>
              <IconButton href={socialLinks.whatsapp} target="_blank" aria-label="WhatsApp"
                sx={{ bgcolor: "#25d366", "&:hover": { bgcolor: "#1eb854", transform: "scale(1.15)" }, transition: "0.3s" }}>
                <WhatsApp />
              </IconButton>
            </Stack>
          </Grid>

          {/* Company */}
          <Grid item xs={6} sm={3}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 4, color: "#4a6cf7" }}>Company</Typography>
            <Stack spacing={2.8}>
              <Link component={RouterLink} to="/about" color="grey.400" underline="none"
                sx={{ "&:hover": { color: "#4a6cf7", transform: "translateX(6px)" }, transition: "0.3s" }}>About Us</Link>
              <Link component={RouterLink} to="/careers" color="grey.400" underline="none"
                sx={{ "&:hover": { color: "#4a6cf7", transform: "translateX(6px)" }, transition: "0.3s" }}>Careers</Link>
              <Link component={RouterLink} to="/blog" color="grey.400" underline="none"
                sx={{ "&:hover": { color: "#4a6cf7", transform: "translateX(6px)" }, transition: "0.3s" }}>Blog</Link>
            </Stack>
          </Grid>

          {/* Support */}
          <Grid item xs={6} sm={3}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 4, color: "#4a6cf7" }}>Support</Typography>
            <Stack spacing={2.8}>
              <Link component={RouterLink} to="/help" color="grey.400" underline="none"
                sx={{ "&:hover": { color: "#4a6cf7", transform: "translateX(6px)" }, transition: "0.3s" }}>Help Center</Link>
              <Link component={RouterLink} to="/faq" color="grey.400" underline="none"
                sx={{ "&:hover": { color: "#4a6cf7", transform: "translateX(6px)" }, transition: "0.3s" }}>FAQ</Link>
              <Link component={RouterLink} to="/contact" color="grey.400" underline="none"
                sx={{ "&:hover": { color: "#4a6cf7", transform: "translateX(6px)" }, transition: "0.3s" }}>Contact Us</Link>
            </Stack>
          </Grid>

          {/* Legal */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 4, color: "#4a6cf7" }}>Legal</Typography>
            <Stack spacing={2.8}>
              <Link component={RouterLink} to="/privacy" color="grey.400" underline="none"
                sx={{ "&:hover": { color: "#4a6cf7", transform: "translateX(6px)" }, transition: "0.3s" }}>Privacy Policy</Link>
              <Link component={RouterLink} to="/terms" color="grey.400" underline="none"
                sx={{ "&:hover": { color: "#4a6cf7", transform: "translateX(6px)" }, transition: "0.3s" }}>Terms of Service</Link>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 10, bgcolor: "grey.800", opacity: 0.5 }} />

        {/* Bottom Bar – مع clickable phone & email */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={3}
        >
          <Typography variant="body2" color="grey.500" align="center">
            © {year} Tripper. All rights reserved. Made with love in Egypt
          </Typography>

          <Stack direction="row" spacing={4} color="grey.400" sx={{ fontSize: "0.95rem" }}>
            {/* Phone – clickable */}
            <Link
              href="tel:+201222339497"
              color="inherit"
              underline="none"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                "&:hover": { color: "#4a6cf7", transform: "translateY(-1px)" },
                transition: "all 0.3s",
              }}
            >
              <Phone fontSize="small" />
              +20 122 233 9497
            </Link>

            {/* Email – clickable */}
            <Link
              href="mailto:support@tripper.com"
              color="inherit"
              underline="none"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                "&:hover": { color: "#4a6cf7", transform: "translateY(-1px)" },
                transition: "all 0.3s",
              }}
            >
              <EmailIcon fontSize="small" />
              support@tripper.com
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}