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
};

export default authService;
