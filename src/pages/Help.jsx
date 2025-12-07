import { Container, Typography, Box, Accordion, AccordionSummary, AccordionDetails, Button } from "@mui/material";
import { ExpandMore, WhatsApp, Email, Phone } from "@mui/icons-material";

export default function Help() {
  const faqs = [
    { q: "How do I book an experience?", a: "Browse → Pick a date → Click Book Now → Pay securely. Done!" },
    { q: "What’s your cancellation policy?", a: "Free cancellation up to 24 hours before. Full refund, no questions asked." },
    { q: "Are hosts verified?", a: "Yes! Every host passes ID verification + background check." },
    { q: "Can I message the host before booking?", a: "Absolutely! Chat with them directly to ask anything." },
    { q: "What payment methods do you accept?", a: "Credit cards, Apple Pay, Google Pay, and local wallets." },
  ];

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: { xs: 10, md: 16 } }}>
      <Container maxWidth="md">
        <Box textAlign="center" mb={10}>
          <Typography variant="h2" fontWeight="bold" sx={{ fontSize: { xs: "3rem", md: "4.5rem" } }}>
            How Can We Help?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: 3 }}>
            98% of questions are answered here
          </Typography>
        </Box>

        {faqs.map((faq, i) => (
          <Accordion key={i} sx={{ mb: 3, borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
            <AccordionSummary expandIcon={<ExpandMore sx={{ color: "#4a6cf7" }} />}>
              <Typography fontWeight="bold" sx={{ color: "#0f172a" }}>{faq.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary" sx={{ lineHeight: 1.9 }}>{faq.a}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}

        <Box textAlign="center" mt={10} p={6} sx={{ bgcolor: "white", borderRadius: 5, boxShadow: "0 15px 40px rgba(0,0,0,0.1)" }}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
            Still stuck?
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 5 }}>
            Our team replies in under 5 minutes (really!)
          </Typography>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 3, justifyContent: "center" }}>
            <Button variant="contained" size="large" startIcon={<WhatsApp />} href="https://wa.me/201222339497" target="_blank">
              Chat on WhatsApp
            </Button>
            <Button variant="outlined" size="large" startIcon={<Email />} href="mailto:support@tripper.com">
              Email Us
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}