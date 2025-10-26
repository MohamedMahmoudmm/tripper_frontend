import axiosInstance from "../axiousInstance/axoiusInstance";
const hotelService = {
  getAllHotels: async () => {
    const res = await axiosInstance.get("/hotel");
    return res.data;
  },

  getHotelById: async (id) => {
    const res = await axiosInstance.get(`/hotel/${id}`);
    return res.data;
  },

  searchHotels: async (filters) => {
    const params = new URLSearchParams(filters).toString();
    const res = await axiosInstance.get(`/hotel/search?${params}`);
    return res.data;
  },
};

export default hotelService;