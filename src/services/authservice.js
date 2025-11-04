import axiosInstance from "../axiousInstance/axoiusInstance";

const authService = {
  signup: async (data) => {
    const res = await axiosInstance.post("/user/signup", data);
    return res.data;
  },

  signin: async (data) => {
    const res = await axiosInstance.post("/user/signin", data);
    return res.data;
  },

  swichRole: async (data) => {
    const res = await axiosInstance.patch("/user/switch-role", data);
    return res.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  saveAuthData: (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },

  getAuthData: () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    return { user, token };
  },

  getCurrentUser: async () => {
    const res = await axiosInstance.get("/user/profile");
    return res.data.user;
  },
};

export default authService;
