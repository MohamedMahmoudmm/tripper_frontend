import React, { useEffect, useState, useCallback } from "react";
import { hotelReservationsService } from "../../../services/reservationsService";
import ReservationsList from "../../../components/host/reservations/ReservationsList";

const HotelReservationsList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [filters, setFilters] = useState({
    status: 'all',
    page: 1,
    limit: 10
  });

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await hotelReservationsService.getAll(filters);
      setReservations(data.reservations || []);
      setPagination(prev => data.pagination || prev);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load reservations");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleAccept = async (res) => {
    try {
      await hotelReservationsService.confirm(res._id);
      fetchReservations();
    } catch (err) {
      console.error(err);
      setError("Failed to accept reservation");
    }
  };

  const handleReject = async (res) => {
    try {
      await hotelReservationsService.reject(res._id);
      fetchReservations();
    } catch (err) {
      console.error(err);
      setError("Failed to reject reservation");
    }
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleStatusFilterChange = (newStatus) => {
    setFilters(prev => ({ ...prev, status: newStatus, page: 1 }));
  };

  const handleItemsPerPageChange = (newLimit) => {
    setFilters(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const calculateNights = (checkIn, checkOut) => {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diff = outDate - inDate;
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  };

  return (
    <ReservationsList
      title="Hotel Reservations"
      reservations={reservations}
      loading={loading}
      error={error}
      onAccept={handleAccept}
      onReject={handleReject}
      detailsBasePath="/host/reservations"
      pagination={pagination}
      onPageChange={handlePageChange}
      statusFilter={filters.status}
      onStatusFilterChange={handleStatusFilterChange}
      onItemsPerPageChange={handleItemsPerPageChange}
      fields={[
        { key: "guest", label: "Guest", render: (r) => r.guestId?.name || "N/A" },
        { key: "hotel", label: "Hotel", render: (r) => r.hotelId?.name || "N/A" },
        {
          key: "checkIn",
          label: "Check-in",
          render: (r) => new Date(r.checkIn).toLocaleDateString("en-GB"),
        },
        {
          key: "checkOut",
          label: "Check-out",
          render: (r) => new Date(r.checkOut).toLocaleDateString("en-GB"),
        },
        {
          key: "nights",
          label: "Nights",
          render: (r) => calculateNights(r.checkIn, r.checkOut),
        },
        { key: "totalPrice", label: "Total ($)", render: (r) => `$${r.totalPrice}` },
        { 
          key: "paymentStatus", 
          label: "Payment", 
          render: r => r.paymentStatus || "unpaid" 
        }
      ]}
    />
  );
};

export default HotelReservationsList;