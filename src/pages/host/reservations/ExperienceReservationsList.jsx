import React, { useEffect, useState, useCallback } from "react";
import { experienceReservationsService } from "../../../services/reservationsService";
import ReservationsList from "../../../components/host/reservations/ReservationsList";

const ExperienceReservationsList = () => {
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
      const data = await experienceReservationsService.getAll(filters);
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
      await experienceReservationsService.confirm(res._id);
      fetchReservations();
    } catch (err) {
      console.error(err);
      setError("Failed to accept reservation");
    }
  };

  const handleReject = async (res) => {
    try {
      await experienceReservationsService.reject(res._id);
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

  return (
    <ReservationsList
      title="Experience Reservations"
      reservations={reservations}
      loading={loading}
      error={error}
      onAccept={handleAccept}
      onReject={handleReject}
      detailsBasePath="/host/reservations/experience"
      pagination={pagination}
      onPageChange={handlePageChange}
      statusFilter={filters.status}
      onStatusFilterChange={handleStatusFilterChange}
      onItemsPerPageChange={handleItemsPerPageChange}
      fields={[
        { key: "guest", label: "Guest", render: (r) => r.guestId?.name || "N/A" },
        { 
          key: "experience", 
          label: "Experience", 
          render: (r) => r.experienceId?.name || "N/A" 
        },
        { key: "guestsCount", label: "Guests" },
        {
          key: "date",
          label: "Date",
          render: (r) => new Date(r.checkIn).toLocaleDateString("en-GB"),
        },
        { 
          key: "totalPrice", 
          label: "Total ($)", 
          render: (r) => `$${r.totalPrice}` 
        },
      ]}
    />
  );
};

export default ExperienceReservationsList;