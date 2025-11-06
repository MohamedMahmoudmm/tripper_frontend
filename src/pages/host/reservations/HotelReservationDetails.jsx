import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { hotelReservationsService } from "../../../services/reservationsService";
import ReservationDetailsLayout from "../../../components/host/reservations/ReservationDetailsLayout";

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

  return (
    <ReservationDetailsLayout
      loading={loading}
      reservation={reservation}
      title={hotel?.name}
      subtitle={`${hotel?.address?.city || ""}, ${hotel?.address?.country || ""}`}
      leftSection={
        <>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            Guest Details
          </Typography>
          <Typography><b>Name:</b> {guest?.name}</Typography>
          <Typography><b>Email:</b> {guest?.email}</Typography>
          <Typography><b>Guests:</b> {reservation.guestsCount}</Typography>
        </>
      }
      rightSection={
        <>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            Stay Details
          </Typography>
          <Typography><b>Check-in:</b> {new Date(reservation.checkIn).toLocaleDateString("en-GB")}</Typography>
          <Typography><b>Check-out:</b> {new Date(reservation.checkOut).toLocaleDateString("en-GB")}</Typography>
          <Typography><b>Nights:</b> {nights}</Typography>
        </>
      }
      totalPrice={reservation.totalPrice}
      viewBtnLabel="View Hotel"
      onViewClick={() => navigate(`/hotel/details/${hotel?._id}`)}
    />
  );
};

export default HotelReservationDetails;
