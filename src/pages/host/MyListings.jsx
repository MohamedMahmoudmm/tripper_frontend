import React from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Stack,
  Chip,
  Button,
  Divider,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const listings = [
  { id: 1, title: "Modern Apartment", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", price: 120, status: "active" },
  { id: 2, title: "Modern Apartment", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", price: 120, status: "active" },
  { id: 3, title: "Modern Apartment", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", price: 120, status: "active" },
  { id: 4, title: "Modern Apartment", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", price: 120, status: "active" },
  { id: 5, title: "Modern Apartment", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", price: 120, status: "active" },

];

const MyListings = () => {
  const navigate = useNavigate();

  const handleEdit = (listing) =>
    navigate(`/host/edit/${listing.id}`, { state: { listing } });
  const handleDelete = (id) => console.log("Delete listing:", id);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          My Listings
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/host/add")}
          sx={{
            bgcolor: "#FF385C",
            borderRadius: 3,
            px: 3,
            py: 1,
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": { bgcolor: "#e22d50" },
          }}
        >
          + Add Listing
        </Button>
      </Box>

      <Grid container spacing={3}>
        {listings.map((listing) => (
          <Grid item xs={12} sm={6} md={4} key={listing.id}>
            <Card
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
                transition: "0.3s ease",
                backgroundColor: "#fff",
                "&:hover": {
                  boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
                  transform: "translateY(-5px)",
                },
              }}
            >
              {/* Image */}
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  image={listing.image}
                  alt={listing.title}
                  sx={{ height: 220, objectFit: "cover" }}
                />
                <Chip
                  label={
                    listing.status === "active" ? "Active" : "Inactive"
                  }
                  color={listing.status === "active" ? "success" : "default"}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    fontWeight: "bold",
                    backgroundColor:
                      listing.status === "active" ? "#4CAF50" : "#9e9e9e",
                    color: "#fff",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 10,
                    left: 10,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    color: "#fff",
                    borderRadius: 2,
                    px: 1.2,
                    py: 0.3,
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  }}
                >
                  ${listing.price} / night
                </Box>
              </Box>

              {/* Card Content */}
              <CardContent
                sx={{
                  px: 2.5,
                  py: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  noWrap
                  gutterBottom
                >
                  {listing.title}
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleEdit(listing)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(listing.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    ID: {listing.id}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MyListings;
