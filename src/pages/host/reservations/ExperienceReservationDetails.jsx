import React, { useEffect, useState } from "react";
import { Typography, Box, Stack, Divider, Avatar, Chip, Badge } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { experienceReservationsService } from "../../../services/reservationsService";
import ReservationDetailsLayout from "../../../components/host/reservations/ReservationDetailsLayout";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import GroupIcon from "@mui/icons-material/Group";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ExploreIcon from "@mui/icons-material/Explore";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PhoneIcon from "@mui/icons-material/Phone";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

const ExperienceReservationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const res = await experienceReservationsService.getById(id);
        setReservation(res);
      } catch (error) {
        console.error("Error fetching experience reservation:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReservation();
  }, [id]);

  if (!reservation) return <ReservationDetailsLayout loading={loading} />;

  const { experienceId: exp, guestId: guest } = reservation;

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
      title={exp?.name}
      subtitle={`${exp?.address?.city || ""}, ${exp?.address?.country || ""}`}
      images={exp?.images || []}
      starRating={exp?.starRating}
      showPaymentStatus={false}
      showActionButtons={false}
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
                {guest?.isVerified === "verified" ? "Verified Guest" : "Participant Details"}
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
            <InfoRow icon={<PhoneIcon />} label="Contact Number" value={guest.phone} />
          )}
          <InfoRow
            icon={<GroupIcon />}
            label="Number of Participants"
            value={`${reservation.guestsCount} ${reservation.guestsCount === 1 ? 'person' : 'people'}`}
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
            Experience Details
          </Typography>

          <Divider sx={{ my: 2 }} />

          <InfoRow
            icon={<CalendarTodayIcon />}
            label="Experience Date"
            value={new Date(reservation.checkIn).toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          />

          <InfoRow
            icon={<LocationOnIcon />}
            label="Location"
            value={`${exp?.address?.city || ""}, ${exp?.address?.country || ""}`}
          />

          {/* Available Dates */}
          {exp?.dates && exp.dates.length > 1 && (
            <Box sx={{ mt: 3, p: 2, backgroundColor: "#FFF3E0", borderRadius: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <EventAvailableIcon sx={{ color: "#FF9800", fontSize: 20 }} />
                <Typography variant="caption" fontWeight="600" color="#FF9800">
                  Other Available Dates
                </Typography>
              </Stack>
              <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
                {exp.dates
                  .filter(d => new Date(d).getTime() !== new Date(reservation.checkIn).getTime())
                  .slice(0, 3)
                  .map((date, idx) => (
                    <Chip
                      key={idx}
                      label={new Date(date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                      size="small"
                      sx={{
                        backgroundColor: "#fff",
                        border: "1px solid #FFE0B2",
                        color: "#FF9800",
                        fontSize: "0.75rem",
                      }}
                    />
                  ))}
                {exp.dates.length > 4 && (
                  <Chip
                    label={`+${exp.dates.length - 4} more`}
                    size="small"
                    sx={{
                      backgroundColor: "#fff",
                      border: "1px solid #FFE0B2",
                      color: "#FF9800",
                      fontSize: "0.75rem",
                    }}
                  />
                )}
              </Stack>
            </Box>
          )}

          {/* Description Box */}
          <Box
            sx={{
              mt: 3,
              p: 2.5,
              backgroundColor: "#F8F9FA",
              borderRadius: 2,
              border: "1px solid #E0E0E0",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
              <ExploreIcon sx={{ color: "#667eea" }} />
              <Typography variant="subtitle1" fontWeight="bold">
                About This Experience
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.7, textAlign: "justify" }}
            >
              {exp?.description || "No description available"}
            </Typography>
          </Box>

          {/* Activities */}
          {exp?.activities && exp.activities.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle2" fontWeight="bold">
                  What's Included
                </Typography>
                <Chip 
                  label={`${exp.activities.length} ${exp.activities.length === 1 ? 'Activity' : 'Activities'}`}
                  size="small"
                  sx={{ 
                    backgroundColor: "#667eea", 
                    color: "#fff", 
                    fontWeight: 600,
                    fontSize: "0.75rem"
                  }}
                />
              </Stack>
              <Stack spacing={1.5}>
                {exp.activities.map((activity, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid #E0E0E0",
                      backgroundColor: "#FAFAFA",
                      display: "flex",
                      gap: 2,
                      alignItems: "flex-start",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: "#667eea",
                        backgroundColor: "#F0F4FF",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    {activity.image && (
                      <Box
                        component="img"
                        src={activity.image}
                        alt={activity.title}
                        sx={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 1.5,
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: "#667eea",
                            flexShrink: 0,
                          }}
                        />
                        <Typography variant="body1" fontWeight="600" sx={{ fontSize: "0.95rem" }}>
                          {activity.title}
                        </Typography>
                      </Stack>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          fontSize: "0.85rem",
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {activity.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Price per person */}
          {exp?.price && (
            <Box
              sx={{
                mt: 3,
                p: 2.5,
                backgroundColor: "#F0F4FF",
                borderRadius: 2,
                border: "1px solid #E0E0E0",
              }}
            >
              <Typography variant="caption" color="text.secondary" mb={2} display="block">
                Price Breakdown
              </Typography>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    ${exp.price} × {reservation.guestsCount} {reservation.guestsCount === 1 ? 'person' : 'people'}
                  </Typography>
                  <Typography variant="body2" fontWeight="600">
                    ${(exp.price * reservation.guestsCount).toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          )}
        </Box>
      }
      totalPrice={reservation.totalPrice}
      viewBtnLabel="View Experience Details"
      onViewClick={() => navigate(`/experiance/details/${exp?._id}`)}
    />
  );
};

export default ExperienceReservationDetails;