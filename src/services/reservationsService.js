import axiosInstance from "../axiousInstance/axoiusInstance";

export const hotelReservationsService = {
  // Get all hotel reservations with pagination
  getAll: async (params = {}) => {
    const { page = 1, limit = 10, status = 'all' } = params;
    const res = await axiosInstance.get("/api/reservations/host", {
      params: {
        page,
        limit,
        status: status !== 'all' ? status : undefined,
        type: 'hotel'
      }
    });
    return res.data;
  },

  // Get one hotel reservation details    
  getById: async (id) => {
    const res = await axiosInstance.get(`/api/reservations/${id}`);
    return res.data;
  },

  // Accept reservation
  confirm: async (id) => {
    const res = await axiosInstance.patch(`/api/reservations/${id}/status`, {
      status: "confirmed",
    });
    return res.data;
  },

  // Reject reservation
  reject: async (id) => {
    const res = await axiosInstance.patch(`/api/reservations/${id}/status`, {
      status: "cancelled",
    });
    return res.data;
  },
};

export const experienceReservationsService = {
  // Get all experience reservations with pagination   
  getAll: async (params = {}) => {
    const { page = 1, limit = 10, status = 'all' } = params;
    const res = await axiosInstance.get("/api/reservations/host", {
      params: {
        page,
        limit,
        status: status !== 'all' ? status : undefined,
        type: 'experience'
      }
    });
    return res.data;
  },

  // Get one experience reservation details
  getById: async (id) => {
    const res = await axiosInstance.get(`/api/reservations/${id}`);
    return res.data;
  },

  // Accept experience reservation
  confirm: async (id) => {
    const res = await axiosInstance.patch(`/api/reservations/${id}/status`, {
      status: "confirmed",
    });
    return res.data;
  },

  // Reject experience reservation
  reject: async (id) => {
    const res = await axiosInstance.patch(`/api/reservations/${id}/status`, {
      status: "cancelled",
    });
    return res.data;
  },
};

export const userReservationsService = {
  getAll: async (params = {}) => {
    const { page = 1, limit = 10, status = 'all', type } = params;
    const res = await axiosInstance.get("/api/reservations/my", {
      params: {
        page,
        limit,
        status: status !== 'all' ? status : undefined,
        type
      }
    });
    return res.data;
  },
};