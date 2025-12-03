import React, { useEffect, useState, useMemo } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  CircularProgress,
  alpha,
  Card,
  Fade,
  Grow,
  TextField,
  MenuItem,
  Pagination,
  InputAdornment,
} from "@mui/material";
import { Add, Hotel, Celebration, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import hotelService from "../../services/hotels.service";
import experienceService from "../../services/experince.service";
import ListingCard from "../../components/host/ListingCard";

const ITEMS_PER_PAGE = 6;

const MyListings = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
  });

  // Filter & Pagination States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const handleTabChange = (e, newValue) => {
    setTab(newValue);
    setCurrentPage(1);
    setSearchQuery("");
    setSortBy("newest");
  };

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
      toast.error("Error fetching listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [tab]);

  // Filter and Sort Logic
  const filteredListings = useMemo(() => {
    let filtered = [...listings];

    if (searchQuery) {
      filtered = filtered.filter((listing) =>
        listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.address?.city?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === "price-low") {
      filtered.sort((a, b) => {
        const priceA = a.rooms && a.rooms.length > 0
          ? Math.min(...a.rooms.map((r) => r.price))
          : a.price;
        const priceB = b.rooms && b.rooms.length > 0
          ? Math.min(...b.rooms.map((r) => r.price))
          : b.price;
        return priceA - priceB;
      });
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => {
        const priceA = a.rooms && a.rooms.length > 0
          ? Math.min(...a.rooms.map((r) => r.price))
          : a.price;
        const priceB = b.rooms && b.rooms.length > 0
          ? Math.min(...b.rooms.map((r) => r.price))
          : b.price;
        return priceB - priceA;
      });
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [listings, searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE);
  const paginatedListings = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredListings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredListings, currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      toast.success("Listing deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete listing");
    } finally {
      handleCloseDialog();
    }
  };

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", pb: 6 }}>
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        {/* Header Section */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              My Listings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your hotels and experiences
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddListing}
            sx={{
              bgcolor: "#FF385C",
              borderRadius: "12px",
              px: 3,
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(255, 56, 92, 0.3)",
              "&:hover": {
                bgcolor: "#E31C5F",
                boxShadow: "0 6px 16px rgba(255, 56, 92, 0.4)",
              },
            }}
          >
            Add New {tab === 0 ? "Hotel" : "Experience"}
          </Button>
        </Box>

        {/* Tabs */}
        <Card elevation={0} sx={{ mb: 3, borderRadius: "16px", border: "1px solid #e0e0e0" }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            centered
            sx={{
              px: 2,
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                minHeight: "64px",
                "&.Mui-selected": {
                  color: "#FF385C",
                },
              },
              "& .MuiTabs-indicator": {
                bgcolor: "#FF385C",
                height: 3,
              },
            }}
          >
            <Tab icon={<Hotel />} iconPosition="start" label="Hotels" />
            <Tab icon={<Celebration />} iconPosition="start" label="Experiences" />
          </Tabs>
        </Card>

        {/* Filters */}
        <Card elevation={0} sx={{ p: 3, mb: 4, borderRadius: "16px", border: "1px solid #e0e0e0" }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={7}>
              <TextField
                fullWidth
                placeholder="Search by name or city..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "#717171" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: "#f5f5f5",
                    "& fieldset": {
                      borderColor: "transparent",
                    },
                    "&:hover fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#FF385C",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                select
                fullWidth
                label="Sort By"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "&.Mui-focused fieldset": {
                      borderColor: "#FF385C",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#FF385C",
                  },
                }}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="name">Name (A-Z)</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Card>

        {/* Loading / Empty / Listings */}
        {loading ? (
          <Fade in>
            <Card elevation={0} sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px", flexDirection: "column", borderRadius: "20px", border: "1px solid #e0e0e0" }}>
              <CircularProgress sx={{ color: "#FF385C", mb: 2 }} size={48} />
              <Typography color="text.secondary" fontSize="1.1rem">
                Loading your listings...
              </Typography>
            </Card>
          </Fade>
        ) : filteredListings.length === 0 ? (
          <Fade in>
            <Card elevation={0} sx={{ textAlign: "center", py: 10, borderRadius: "20px", border: "1px solid #e0e0e0" }}>
              <Box sx={{ width: 120, height: 120, borderRadius: "50%", bgcolor: alpha("#FF385C", 0.1), display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", mb: 3 }}>
                {tab === 0 ? <Hotel sx={{ fontSize: 60, color: "#FF385C" }} /> : <Celebration sx={{ fontSize: 60, color: "#FF385C" }} />}
              </Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {listings.length === 0 ? `No ${tab === 0 ? "Hotels" : "Experiences"} Yet` : "No Results Found"}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: "auto" }}>
                {listings.length === 0 
                  ? `Start by creating your first ${tab === 0 ? "hotel listing" : "experience"} to welcome guests`
                  : "Try adjusting your filters or search query"
                }
              </Typography>
              {listings.length === 0 && (
                <Button
                  variant="contained"
                  onClick={handleAddListing}
                  startIcon={<Add />}
                  sx={{ bgcolor: "#FF385C", borderRadius: "12px", px: 4, py: 1.5, textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "#E31C5F" } }}
                >
                  Create {tab === 0 ? "Hotel" : "Experience"}
                </Button>
              )}
            </Card>
          </Fade>
        ) : (
          <>
            <Grid container spacing={3}>
              {paginatedListings.map((listing, index) => (
                <Grow in timeout={300 + index * 100} key={listing._id}>
                  <Grid item xs={12} sm={6} md={6} lg={4}>
                    <ListingCard
                      listing={listing}
                      type={tab === 0 ? 'hotel' : 'experience'}
                      onEdit={() => handleEdit(listing)}
                      onDelete={() => handleOpenDialog(listing._id)}
                    />
                  </Grid>
                </Grow>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  size="large"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      borderRadius: "10px",
                      fontWeight: 600,
                      "&.Mui-selected": {
                        bgcolor: "#FF385C",
                        color: "white",
                        "&:hover": { bgcolor: "#E31C5F" },
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}

        {/* Delete Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={handleCloseDialog}
          PaperProps={{ sx: { borderRadius: "16px", maxWidth: "420px" } }}
        >
          <DialogTitle sx={{ fontWeight: 600, fontSize: "1.5rem", pb: 1 }}>
            {tab === 0 ? "Delete Hotel?" : "Delete Experience?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ fontSize: "1rem", color: "text.secondary" }}>
              {tab === 0
                ? "This hotel will be permanently removed. This action cannot be undone."
                : "This experience will be permanently removed. This action cannot be undone."}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button onClick={handleCloseDialog} sx={{ textTransform: "none", fontWeight: 600, color: "#717171", px: 3, borderRadius: "10px" }}>
              Cancel
            </Button>
            <Button onClick={confirmDelete} variant="contained" sx={{ textTransform: "none", fontWeight: 600, bgcolor: "#FF385C", px: 3, borderRadius: "10px", "&:hover": { bgcolor: "#E31C5F" } }}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MyListings;