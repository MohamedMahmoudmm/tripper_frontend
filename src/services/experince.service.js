import axiosInstance from "../axiousInstance/axoiusInstance";
const experienceService = {
  getAllExperiences: async () => {
    const res = await axiosInstance.get("/experiance");
    return res.data;
  },

  getExperienceById: async (id) => {
    const res = await axiosInstance.get(`/experiance/${id}`);
    return res.data;
  },

  searchExperiences: async (filters) => {
    const params = new URLSearchParams(filters).toString();
    const res = await axiosInstance.get(`/experience/search?${params}`);
    return res.data;
  },
};

export default experienceService;