import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import hotelService from "../../services/hotels.service";
import experienceService from "../../services/experince.service";
import ListingCard from "../../components/host/ListingCard";

const MyListings = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
  });

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const handleTabChange = (e, newValue) => setTab(newValue);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const data =
        tab === 0
          ? await hotelService.getHostHotels()
          : await experienceService.getHostExperiences();
      setListings(data);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Error fetching listings",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [tab]);

const handleEdit = (listing) => {
  if (tab === 0) {
    navigate(`/host/hotels/edit/${listing._id}`);
  } else {
    navigate(`/host/experiences/update/${listing._id}`);
  }
};


  const handleAddListing = () => {
  if (tab === 0) navigate("/host/add-hotel");
  else navigate("/host/experiences/add");
};

  const handleOpenDialog = (id) => setDeleteDialog({ open: true, id });
  const handleCloseDialog = () => setDeleteDialog({ open: false, id: null });

  const confirmDelete = async () => {
    try {
      if (tab === 0) await hotelService.deleteHotel(deleteDialog.id);
      else await experienceService.deleteExperience(deleteDialog.id);
      setListings((prev) =>
        prev.filter((item) => item._id !== deleteDialog.id)
      );
      setSnackbar({
        open: true,
        message: "Listing deleted successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to delete listing",
        severity: "error",
      });
    } finally {
      handleCloseDialog();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
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
          onClick={handleAddListing}
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

      <Tabs
        value={tab}
        onChange={handleTabChange}
        sx={{
          borderBottom: "1px solid #eee",
          mb: 4,
          "& .MuiTab-root": { textTransform: "none", fontWeight: 600 },
          "& .Mui-selected": { color: "#FF385C !important" },
          "& .MuiTabs-indicator": { backgroundColor: "#FF385C" },
        }}
      >
        <Tab label="Hotels" />
        <Tab label="Experiences" />
      </Tabs>

      {loading ? (
        <Typography align="center" color="text.secondary" sx={{ mt: 6 }}>
          Loading listings...
        </Typography>
      ) : listings.length === 0 ? (
        <Typography align="center" color="text.secondary" sx={{ mt: 6 }}>
          You have no {tab === 0 ? "hotels" : "experiences"} yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {listings.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
              onEdit={() => handleEdit(listing)}
              onDelete={() => handleOpenDialog(listing._id)}
            />
          ))}
        </Grid>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog open={deleteDialog.open} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this listing? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyListings;
