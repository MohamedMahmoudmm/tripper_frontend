import React from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";

const reservations = [
  {
    id: 1,
    guest: "Alice Johnson",
    listing: "Modern Apartment in Downtown",
    date: "2025-11-01",
    nights: 3,
    status: "confirmed",
  },
  {
    id: 2,
    guest: "Mark Smith",
    listing: "Luxury Villa with Pool",
    date: "2025-11-05",
    nights: 5,
    status: "cancelled",
  },
  {
    id: 3,
    guest: "Sophia Lee",
    listing: "Cozy Cabin in the Mountains",
    date: "2025-11-10",
    nights: 2,
    status: "upcoming",
  },
];

const statusColors = {
  confirmed: "success",
  cancelled: "error",
  upcoming: "warning",
};

const Reservations = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Reservations
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell>Guest</TableCell>
              <TableCell>Listing</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Nights</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((res) => (
              <TableRow
                key={res.id}
                sx={{
                  "&:hover": { backgroundColor: "#f9f9f9", cursor: "pointer" },
                }}
              >
                <TableCell>{res.guest}</TableCell>
                <TableCell>{res.listing}</TableCell>
                <TableCell>{res.date}</TableCell>
                <TableCell>{res.nights}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      res.status.charAt(0).toUpperCase() + res.status.slice(1)
                    }
                    color={statusColors[res.status]}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Reservations;
