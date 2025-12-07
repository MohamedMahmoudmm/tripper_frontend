import axiosInstance from "../axiousInstance/axoiusInstance";


export const planService = {
  // Create new plan
  create: async (planData) => {
    const res = await axiosInstance.post("/api/plans", planData);
    return res.data;
  },

  // Get all user's plans
  getAll: async () => {
    const res = await axiosInstance.get("/api/plans");
    return res.data;
  },

  // Get plan by ID
  getById: async (id) => {
    const res = await axiosInstance.get(`/api/plans/${id}`);
    return res.data;
  },

  // Update plan
  update: async (id, updateData) => {
    const res = await axiosInstance.put(`/api/plans/${id}`, updateData);
    return res.data;
  },

  // Delete plan
  delete: async (id) => {
    const res = await axiosInstance.delete(`/api/plans/${id}`);
    return res.data;
  },

  // Book entire plan
  book: async (id) => {
    const res = await axiosInstance.post(`/api/plans/${id}/book`);
    return res.data;
  },

  // Add hotel to plan
  addHotel: async (planId, hotelData) => {
    const res = await axiosInstance.post(`/api/plans/${planId}/hotels`, hotelData);
    return res.data;
  },

  // Add experience to plan
  addExperience: async (planId, experienceData) => {
    const res = await axiosInstance.post(`/api/plans/${planId}/experiences`, experienceData);
    return res.data;
  },

  // Remove hotel from plan
  removeHotel: async (planId, hotelId) => {
    const res = await axiosInstance.delete(`/api/plans/${planId}/hotels/${hotelId}`);
    return res.data;
  },

  // Remove experience from plan
  removeExperience: async (planId, experienceId) => {
    const res = await axiosInstance.delete(`/api/plans/${planId}/experiences/${experienceId}`);
    return res.data;
  },
};