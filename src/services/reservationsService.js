import axiosInstance from "../axiousInstance/axoiusInstance";

export const hotelReservationsService = {
  //     get all hotel reservations
  getAll: async () => {
    const res = await axiosInstance.get("/api/reservations/host");
    return res.data.filter((r) => r.hotelId);
  },

  // get one hotel reservation details    
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
};


export const experienceReservationsService = {
  // get all experience reservations    
  getAll: async () => {
    const res = await axiosInstance.get("/api/reservations/host");
    return res.data.filter((r) => r.experienceId);
  },

   // get one experience reservation details
  getById: async (id) => {
    const res = await axiosInstance.get(`/api/reservations/${id}`);
    return res.data;
  },

};
