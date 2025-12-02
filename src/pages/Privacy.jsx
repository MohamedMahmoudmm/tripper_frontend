import { Container, Typography } from "@mui/material";

export default function Privacy() {
  return (
    <Container maxWidth="md" sx={{ py: 10 }}>
      <Typography variant="h3" fontWeight="bold" sx={{ mb: 4 }}>Privacy Policy</Typography>
      <Typography paragraph color="text.secondary" sx={{ lineHeight: 2 }}>
        Your privacy is important to us at Tripper. We collect minimal personal information necessary to provide you with the best experience...
      </Typography>
    </Container>
  );
}