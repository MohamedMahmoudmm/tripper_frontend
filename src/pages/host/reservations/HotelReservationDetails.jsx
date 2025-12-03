import React, { useEffect, useState } from "react";
import { Typography, Box, Stack, Divider, Avatar, Chip, Badge } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { hotelReservationsService } from "../../../services/reservationsService";
import ReservationDetailsLayout from "../../../components/host/reservations/ReservationDetailsLayout";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import GroupIcon from "@mui/icons-material/Group";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import HotelIcon from "@mui/icons-material/Hotel";
import PhoneIcon from "@mui/icons-material/Phone";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

const HotelReservationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const res = await hotelReservationsService.getById(id);
        setReservation(res);
      } catch (error) {
        console.error("Error fetching hotel reservation:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReservation();
  }, [id]);

  if (!reservation) return <ReservationDetailsLayout loading={loading} />;

  const { hotelId: hotel, guestId: guest } = reservation;
  const nights =
    reservation.checkIn && reservation.checkOut
      ? Math.ceil(
          (new Date(reservation.checkOut) - new Date(reservation.checkIn)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const bookedRoom =
    reservation.roomId && hotel?.rooms?.length > 0
      ? hotel.rooms.find((r) => r._id === reservation.roomId)
      : null;

  const InfoRow = ({ icon, label, value, verified }) => (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 1.5 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "10px",
          backgroundColor: "#F0F4FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#667eea",
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
          {label}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body1" fontWeight="600" sx={{ fontSize: "0.95rem" }}>
            {value}
          </Typography>
          {verified && (
            <VerifiedUserIcon sx={{ fontSize: 16, color: "#66BB6A" }} />
          )}
        </Stack>
      </Box>
    </Stack>
  );

  return (
    <ReservationDetailsLayout
      loading={loading}
      reservation={reservation}
      title={hotel?.name}
      subtitle={`${hotel?.address?.street || ""}, ${hotel?.address?.city || ""}, ${hotel?.address?.country || ""}`}
      images={hotel?.images || []}
      starRating={hotel?.starRating}
      amenities={hotel?.amenities || []}
      leftSection={
        <Box>
          <Stack direction="row" spacing={2} alignItems="center" mb={3}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                guest?.isVerified === "verified" ? (
                  <VerifiedUserIcon sx={{ fontSize: 20, color: "#66BB6A" }} />
                ) : null
              }
            >
              <Avatar
                src={guest?.image}
                sx={{
                  width: 56,
                  height: 56,
                  backgroundColor: "#667eea",
                  fontSize: "1.5rem",
                }}
              >
                {guest?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
            </Badge>
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ fontSize: "1.1rem" }}>
                Guest Information
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {guest?.isVerified === "verified" ? "Verified Guest" : "Guest Details"}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <InfoRow 
            icon={<PersonIcon />} 
            label="Full Name" 
            value={guest?.name || "N/A"} 
            verified={guest?.isVerified === "verified"}
          />
          <InfoRow icon={<EmailIcon />} label="Email Address" value={guest?.email || "N/A"} />
          {guest?.phone && (
            <InfoRow icon={<PhoneIcon />} label="Phone Number" value={guest.phone} />
          )}
          <InfoRow
            icon={<GroupIcon />}
            label="Number of Guests"
            value={`${reservation.guestsCount} ${reservation.guestsCount === 1 ? 'guest' : 'guests'}`}
          />

          {/* Guest Role Info */}
          {guest?.role && guest.role.length > 0 && (
            <Box sx={{ mt: 3, p: 2, backgroundColor: "#F8F9FA", borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary" mb={1}>
                User Type
              </Typography>
              <Stack direction="row" spacing={1} mt={1}>
                {guest.role.map((role, idx) => (
                  <Chip
                    key={idx}
                    label={role}
                    size="small"
                    sx={{
                      backgroundColor: role === guest.activeRole ? "#667eea" : "#E0E0E0",
                      color: role === guest.activeRole ? "#fff" : "#666",
                      textTransform: "capitalize",
                      fontWeight: 500,
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      }
      rightSection={
        <Box>
          <Typography variant="h6" fontWeight="bold" mb={3} sx={{ fontSize: "1.1rem" }}>
            Booking Details
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Stay Dates */}
          <Box sx={{ mb: 3 }}>
            <InfoRow
              icon={<CalendarTodayIcon />}
              label="Check-in Date"
              value={new Date(reservation.checkIn).toLocaleDateString("en-GB", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            />
            <InfoRow
              icon={<CalendarTodayIcon />}
              label="Check-out Date"
              value={new Date(reservation.checkOut).toLocaleDateString("en-GB", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            />
            <InfoRow icon={<NightsStayIcon />} label="Total Nights" value={`${nights} ${nights === 1 ? 'night' : 'nights'}`} />
          </Box>

          {/* Room Details */}
          {bookedRoom && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{
                  p: 2.5,
                  backgroundColor: "#F8F9FA",
                  borderRadius: 2,
                  border: "1px solid #E0E0E0",
                  mt: 2,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <HotelIcon sx={{ color: "#667eea" }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Room Information
                  </Typography>
                </Stack>
                
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Room Type
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {bookedRoom.name}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Rooms Booked
                    </Typography>
                    <Chip
                      label={`${reservation.roomCount} ${reservation.roomCount === 1 ? 'room' : 'rooms'}`}
                      size="small"
                      sx={{ backgroundColor: "#667eea", color: "#fff", fontWeight: 600 }}
                    />
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Max Guests per Room
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {bookedRoom.maxGuests} guests
                    </Typography>
                  </Stack>
                  {bookedRoom.price && (
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        Price per Night
                      </Typography>
                      <Typography variant="body2" fontWeight="600" color="#667eea">
                        ${bookedRoom.price}
                      </Typography>
                    </Stack>
                  )}
                </Stack>

                {/* Room Amenities */}
                {bookedRoom.amenities && bookedRoom.amenities.length > 0 && (
                  <Box sx={{ mt: 2, pt: 2, borderTop: "1px dashed #E0E0E0" }}>
                    <Typography variant="caption" color="text.secondary" mb={1} display="block">
                      Room Amenities
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
                      {bookedRoom.amenities.map((amenity, idx) => (
                        <Chip
                          key={idx}
                          label={amenity}
                          size="small"
                          sx={{
                            backgroundColor: "#E8F5E9",
                            color: "#66BB6A",
                            textTransform: "capitalize",
                            fontSize: "0.75rem",
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>
            </>
          )}

          {/* Price Breakdown */} 
          {bookedRoom?.price && (
            <Box sx={{ mt: 3, p: 2, backgroundColor: "#F0F4FF", borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" mb={2}>
                Price Breakdown
              </Typography>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    ${bookedRoom.price} × {nights} nights × {reservation.roomCount} room(s)
                  </Typography>
                  <Typography variant="body2" fontWeight="600">
                    ${(bookedRoom.price * nights * reservation.roomCount).toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          )}
        </Box>
      }
      totalPrice={reservation.totalPrice}
      viewBtnLabel="View Hotel Details"
      onViewClick={() => navigate(`/hotel/details/${hotel?._id}`)}
    />
  );
};

export default HotelReservationDetails;