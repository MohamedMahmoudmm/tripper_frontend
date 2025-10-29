import axiosInstance from "../axiousInstance/axoiusInstance";

const hotelService = {
  getAllHotels: async () => {
    const res = await axiosInstance.get("/hotel");
    return res.data;
  },

  searchHotelsByCity: async (city) => {
    const res = await axiosInstance.get(`/hotel/search?city=${city}`);
    return res.data;
  },

  getHotelById: async (id) => {
    const res = await axiosInstance.get(`/hotel/${id}`);
    return res.data;
  },
};

export default hotelService;
