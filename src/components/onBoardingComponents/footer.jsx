import React from "react";
import { Box, Container, Grid, Typography, Link, Stack, IconButton, Divider } from "@mui/material";
import { Facebook, Instagram, Twitter, WhatsApp } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

export default function Footer() {
  const socialLinks = {
    facebook: "https://facebook.com/tripper",
    instagram: "https://instagram.com/tripper",
    twitter: "https://twitter.com/tripper",
    whatsapp: "https://wa.me/201234567890",
  };

  return (
    <Box sx={{ bgcolor: "#1e293b", color: "white", pt: 10, pb: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Brand */}
          <Grid item xs={12} md={4}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
              Tripper<span style={{ color: "#4a6cf7" }}>.</span>
            </Typography>
            <Typography variant="body2" color="grey.400" sx={{ lineHeight: 1.8, mb: 3 }}>
              Discover unique experiences, local events, and hidden gems in your city and beyond.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton href={socialLinks.facebook} target="_blank" sx={{ bgcolor: "#1877f2", "&:hover": { bgcolor: "#145dbf" } }}>
                <Facebook />
              </IconButton>
              <IconButton href={socialLinks.instagram} target="_blank" sx={{ bgcolor: "transparent", backgroundImage: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", "&:hover": { transform: "scale(1.1)" } }}>
                <Instagram />
              </IconButton>
              <IconButton href={socialLinks.twitter} target="_blank" sx={{ bgcolor: "#1da1f2", "&:hover": { bgcolor: "#0d8bd9" } }}>
                <Twitter />
              </IconButton>
              <IconButton href={socialLinks.whatsapp} target="_blank" sx={{ bgcolor: "#25d366", "&:hover": { bgcolor: "#1fb855" } }}>
                <WhatsApp />
              </IconButton>
            </Stack>
          </Grid>

          {/* Company */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Company
            </Typography>
            <Stack spacing={2}>
              <Link component={RouterLink} to="/about" color="grey.400" underline="none" sx={{ "&:hover": { color: "#4a6cf7" } }}>
                About Us
              </Link>
              <Link component={RouterLink} to="/careers" color="grey.400" underline="none" sx={{ "&:hover": { color: "#4a6cf7" } }}>
                Careers
              </Link>
              <Link component={RouterLink} to="/blog" color="grey.400" underline="none" sx={{ "&:hover": { color: "#4a6cf7" } }}>
                Blog
              </Link>
            </Stack>
          </Grid>

          {/* Support */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Support
            </Typography>
            <Stack spacing={2}>
              <Link component={RouterLink} to="/help" color="grey.400" underline="none" sx={{ "&:hover": { color: "#4a6cf7" } }}>
                Help Center
              </Link>
              <Link component={RouterLink} to="/faq" color="grey.400" underline="none" sx={{ "&:hover": { color: "#4a6cf7" } }}>
                FAQ
              </Link>
              <Link component={RouterLink} to="/contact" color="grey.400" underline="none" sx={{ "&:hover": { color: "#4a6cf7" } }}>
                Contact Us
              </Link>
            </Stack>
          </Grid>

          {/* Legal */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Legal
            </Typography>
            <Stack spacing={2}>
              <Link component={RouterLink} to="/privacy" color="grey.400" underline="none" sx={{ "&:hover": { color: "#4a6cf7" } }}>
                Privacy Policy
              </Link>
              <Link component={RouterLink} to="/terms" color="grey.400" underline="none" sx={{ "&:hover": { color: "#4a6cf7" } }}>
                Terms of Service
              </Link>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6, bgcolor: "grey.800" }} />

        <Typography variant="body2" color="grey.500" align="center">
          © {new Date().getFullYear()} Tripper. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}