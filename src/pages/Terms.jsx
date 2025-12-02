import { Container, Typography } from "@mui/material";

export default function Terms() {
  return (
    <Container maxWidth="md" sx={{ py: 10 }}>
      <Typography variant="h3" fontWeight="bold" sx={{ mb: 4 }}>Terms of Service</Typography>
      <Typography paragraph color="text.secondary" sx={{ lineHeight: 2 }}>
        By using Tripper, you agree to these terms...
      </Typography>
    </Container>
  );
}