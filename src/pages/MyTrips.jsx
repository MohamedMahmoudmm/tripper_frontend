import { useEffect, useState } from "react";
import { userReservationsService } from "../services/reservationsService";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Skeleton,
  Chip,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Divider,
  Stack,
  Avatar,
} from "@mui/material";
import {
  Payment as PaymentIcon,
  Close as CloseIcon,
  CalendarMonth as CalendarIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Hotel as HotelIcon,
  Explore as ExploreIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as PendingIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function MyTrips() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  const handlePayNow = (reservation) => {
    navigate("/payment", {
      state: {
        reservationId: reservation._id,
        amount: reservation.totalPrice,
      },
    });
  };

const handleCardClick = (reservation) => {
  console.log("Full Reservation Data:", reservation);
  console.log("Rooms Array:", reservation.rooms);
  setSelectedReservation(reservation);
  setOpenDialog(true);
};

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTimeout(() => setSelectedReservation(null), 200);
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await userReservationsService.getAll();
        setReservations(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const getStatusConfig = (res) => {
    if (res.paymentStatus === "succeeded") {
      return {
        text: "Paid",
        color: "success",
        icon: <CheckCircleIcon />,
      };
    }
    if (res.status === "confirmed" && res.paymentStatus === "unpaid") {
      return {
        text: "Awaiting Payment",
        color: "warning",
        icon: <PaymentIcon />,
      };
    }
    if (res.status === "pending") {
      return {
        text: "Pending",
        color: "info",
        icon: <PendingIcon />,
      };
    }
    if (res.status === "cancelled") {
      return {
        text: "Cancelled",
        color: "error",
        icon: <CancelIcon />,
      };
    }
    return {
      text: res.status,
      color: "default",
      icon: <InfoIcon />,
    };
  };

  const renderCard = (res) => {
    const hotel = res.hotelId;
    const exp = res.experienceId;

    const img = hotel?.images?.[0] || exp?.images?.[0] || "/placeholder.jpg";
    const title = hotel?.name || exp?.name;
    const price = res.totalPrice;

    const start = new Date(res.checkIn).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
    const end = res.checkOut
      ? new Date(res.checkOut).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        })
      : null;

    const statusConfig = getStatusConfig(res);

    return (
      <Card
        onClick={() => handleCardClick(res)}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
          },
        }}
      >
      <Chip
  label={statusConfig.text}
  color={statusConfig.color}
  icon={statusConfig.icon}
  size="small"
  sx={{
    position: "absolute",
    top: 12,
    left: 12,
    fontWeight: "bold",
    textTransform: "capitalize",
    zIndex: 1,
    backdropFilter: "blur(8px)",
    // احذف السطر ده خالص:
    // backgroundColor: "rgba(255, 255, 255, 0.9)",

    // بدله بالكود ده عشان ياخد لون الـ color الحقيقي مع شفافية حلوة
    backgroundColor: `${statusConfig.color}.main`,
    background: `${statusConfig.color}.main`,
    color: "white",
    opacity: 0.95,
    "& .MuiChip-icon": {
      color: "white",
    },
    // لو عايز شوية شفافية خفيفة على الصورة
    // backgroundColor: `${statusConfig.color}.main + "cc"`, // cc = 80% opacity
  }}
/>
        <CardMedia
          component="img"
          height="200"
          image={img}
          alt={title}
          sx={{ objectFit: "cover" }}
        />

        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {title}
          </Typography>

          <Stack spacing={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {start} {end ? `→ ${end}` : ""}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <PeopleIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {res.guestsCount} guest{res.guestsCount > 1 ? "s" : ""}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <MoneyIcon fontSize="small" color="primary" />
              <Typography variant="h6" fontWeight="bold" color="primary">
                ${price}
              </Typography>
            </Box>
          </Stack>

          {res.status === "confirmed" && res.paymentStatus === "unpaid" && (
            <Button
              variant="contained"
              fullWidth
              startIcon={<PaymentIcon />}
              onClick={(e) => {
                e.stopPropagation();
                handlePayNow(res);
              }}
              sx={{
                mt: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                fontWeight: "bold",
                textTransform: "none",
                py: 1,
                "&:hover": {
                  background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                  transform: "scale(1.02)",
                },
              }}
            >
              Pay Now
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderSkeleton = (count = 6) =>
    Array.from(new Array(count)).map((_, idx) => (
      <Grid item xs={12} sm={6} md={4} key={idx}>
        <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 3 }} />
        <Skeleton height={30} sx={{ mt: 1, borderRadius: 1 }} />
        <Skeleton height={20} sx={{ mt: 0.5, borderRadius: 1 }} />
        <Skeleton height={20} sx={{ mt: 0.5, width: "50%", borderRadius: 1 }} />
      </Grid>
    ));

  const renderDetailsDialog = () => {
    if (!selectedReservation) return null;

    const hotel = selectedReservation.hotelId;
    const exp = selectedReservation.experienceId;
    const img = hotel?.images?.[0] || exp?.images?.[0] || "/placeholder.jpg";
    const title = hotel?.name || exp?.name;
    const statusConfig = getStatusConfig(selectedReservation);

    const checkInDate = new Date(selectedReservation.checkIn);
    const checkOutDate = selectedReservation.checkOut
      ? new Date(selectedReservation.checkOut)
      : null;

    const nights = checkOutDate
      ? Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
      : null;

    return (
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        {/* Header with Image */}
        <Box
          sx={{
            position: "relative",
            height: 200,
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
            }}
          />
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.5)",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.7)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              left: 16,
              right: 16,
            }}
          >
            <Typography variant="h5" fontWeight="bold" color="white" gutterBottom>
              {title}
            </Typography>
           <Chip
  label={statusConfig.text}
  color={statusConfig.color}
  icon={statusConfig.icon}
  size="small"
  sx={{
    position: "absolute",
    top: 12,
    left: 12,
    fontWeight: "bold",
    textTransform: "capitalize",
    zIndex: 1,
    backdropFilter: "blur(8px)",
    backgroundColor: "rgba(0, 123, 255, 0.15)"   
  }}
/>


          </Box>
        </Box>

        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* Booking Details */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
                sx={{ textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}
              >
                Booking Details
              </Typography>
              <Stack spacing={2} mt={1}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarIcon color="action" />
                    <Typography variant="body2">Check-in</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="600">
                    {checkInDate.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Typography>
                </Box>

                {checkOutDate && (
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarIcon color="action" />
                      <Typography variant="body2">Check-out</Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="600">
                      {checkOutDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Typography>
                  </Box>
                )}

                {nights && (
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                      <HotelIcon color="action" />
                      <Typography variant="body2">Duration</Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="600">
                      {nights} night{nights > 1 ? "s" : ""}
                    </Typography>
                  </Box>
                )}

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <PeopleIcon color="action" />
                    <Typography variant="body2">Guests</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="600">
                    {selectedReservation.guestsCount} guest
                    {selectedReservation.guestsCount > 1 ? "s" : ""}
                  </Typography>
                </Box>

                {selectedReservation.roomCount && (
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                      <HotelIcon color="action" />
                      <Typography variant="body2">Rooms</Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="600">
                      {selectedReservation.roomCount} room
                      {selectedReservation.roomCount > 1 ? "s" : ""}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>

            {/* Guest Information */}
           {/* Rooms & Guests Information */}
{selectedReservation.rooms && selectedReservation.rooms.length > 0 && (
  <>
    <Divider />
    <Box>
      <Typography
        variant="subtitle2"
        color="text.secondary"
        gutterBottom
        sx={{ textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}
      >
        Rooms & Guests Information
      </Typography>
      <Stack spacing={3} mt={2}>
        {selectedReservation.rooms.map((roomData, roomIdx) => (
          <Card key={roomIdx} sx={{ p: 2, bgcolor: "grey.50" }}>
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              Room {roomIdx + 1} × {roomData.roomCount}
            </Typography>
            
            <Divider sx={{ my: 1.5 }} />
            
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Guests ({roomData.guestsData.length}):
            </Typography>
            
            <Stack spacing={2} mt={1}>
              {roomData.guestsData.map((guest, guestIdx) => (
                <Box 
                  key={guestIdx} 
                  display="flex" 
                  alignItems="center" 
                  gap={2}
                  sx={{ 
                    p: 1.5, 
                    bgcolor: "white", 
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "grey.200"
                  }}
                >
                  <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                    {guest.name?.[0]?.toUpperCase()}
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="body1" fontWeight="600">
                      {guest.name}
                    </Typography>
                    {guest.email && (
                      <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                        <EmailIcon fontSize="small" sx={{ fontSize: 16 }} color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {guest.email}
                        </Typography>
                      </Box>
                    )}
                    {guest.phone && (
                      <Box display="flex" alignItems="center" gap={0.5} mt={0.3}>
                        <PhoneIcon fontSize="small" sx={{ fontSize: 16 }} color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {guest.phone}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              ))}
            </Stack>
          </Card>
        ))}
      </Stack>
    </Box>
  </>
)}

{/* Guest Information - For old single guest bookings */}
{selectedReservation.guestData && !selectedReservation.rooms && (
  <>
    <Divider />
    <Box>
      <Typography
        variant="subtitle2"
        color="text.secondary"
        gutterBottom
        sx={{ textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}
      >
        Guest Information
      </Typography>
      <Stack spacing={1.5} mt={1}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
            {selectedReservation.guestData.name?.[0]?.toUpperCase()}
          </Avatar>
          <Box flex={1}>
            <Typography variant="body1" fontWeight="600" gutterBottom>
              {selectedReservation.guestData.name}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <EmailIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {selectedReservation.guestData.email}
              </Typography>
            </Box>
            {selectedReservation.guestData.phone && (
              <Box display="flex" alignItems="center" gap={1}>
                <PhoneIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {selectedReservation.guestData.phone}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Stack>
    </Box>
  </>
)}

            {/* Payment Information */}
            <Divider />
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
                sx={{ textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}
              >
                Payment Summary
              </Typography>
              <Box
                sx={{
                  mt: 2,
                  p: 2.5,
                  bgcolor: "primary.50",
                  borderRadius: 2,
                  border: "2px solid",
                  borderColor: "primary.main",
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" fontWeight="bold">
                    Total Amount
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    ${selectedReservation.totalPrice}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Payment Status
                  </Typography>
                  <Chip
                    label={
                      selectedReservation.paymentStatus === "succeeded" ? "Paid" : "Unpaid"
                    }
                    color={
                      selectedReservation.paymentStatus === "succeeded"
                        ? "success"
                        : "warning"
                    }
                    size="small"
                    sx={{ fontWeight: "bold" }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Action Buttons */}
            {selectedReservation.status === "confirmed" &&
              selectedReservation.paymentStatus === "unpaid" && (
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<PaymentIcon />}
                  onClick={() => {
                    handleCloseDialog();
                    handlePayNow(selectedReservation);
                  }}
                  sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    fontWeight: "bold",
                    textTransform: "none",
                    py: 1.5,
                    fontSize: "1rem",
                    "&:hover": {
                      background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                    },
                  }}
                >
                  Proceed to Payment
                </Button>
              )}

            <Typography
              variant="caption"
              color="text.secondary"
              align="center"
              sx={{ pt: 1, display: "block" }}
            >
              Booking ID: {selectedReservation._id}
            </Typography>
          </Stack>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Box p={{ xs: 2, sm: 3 }}>
      {/* Hotels Section */}
      <Box mb={5}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <HotelIcon sx={{ fontSize: 32, color: "primary.main" }} />
          <Typography variant="h5" fontWeight="bold">
            Hotels
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {loading
            ? renderSkeleton()
            : reservations.filter((res) => res.hotelId).length > 0
            ? reservations
                .filter((res) => res.hotelId)
                .map((res) => (
                  <Grid item xs={12} sm={6} md={4} key={res._id}>
                    {renderCard(res)}
                  </Grid>
                ))
            : (
                <Grid item xs={12}>
                  <Box
                    textAlign="center"
                    py={8}
                    sx={{
                      bgcolor: "grey.50",
                      borderRadius: 3,
                      border: "2px dashed",
                      borderColor: "grey.300",
                    }}
                  >
                    <HotelIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No Hotel Reservations Yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Start exploring amazing hotels for your next trip
                    </Typography>
                  </Box>
                </Grid>
              )}
        </Grid>
      </Box>

      {/* Experiences Section */}
      <Box>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <ExploreIcon sx={{ fontSize: 32, color: "primary.main" }} />
          <Typography variant="h5" fontWeight="bold">
            Experiences
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {loading
            ? renderSkeleton()
            : reservations.filter((res) => res.experienceId).length > 0
            ? reservations
                .filter((res) => res.experienceId)
                .map((res) => (
                  <Grid item xs={12} sm={6} md={4} key={res._id}>
                    {renderCard(res)}
                  </Grid>
                ))
            : (
                <Grid item xs={12}>
                  <Box
                    textAlign="center"
                    py={8}
                    sx={{
                      bgcolor: "grey.50",
                      borderRadius: 3,
                      border: "2px dashed",
                      borderColor: "grey.300",
                    }}
                  >
                    <ExploreIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No Experience Reservations Yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Discover unique experiences for unforgettable memories
                    </Typography>
                  </Box>
                </Grid>
              )}
        </Grid>
      </Box>

      {/* Details Dialog */}
      {renderDetailsDialog()}
    </Box>
  );
}