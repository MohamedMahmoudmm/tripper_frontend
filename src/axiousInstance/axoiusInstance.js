import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:4000",
});

axiosInstance.interceptors.request.use((config) => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGY5NmRlYjlmZTZmM2Y5OWM5OTU5ZWIiLCJhY3RpdmVSb2xlIjoiaG9zdCIsImVtYWlsIjoiZGQxMjdiYzNiZkB3ZWJ4aW9zLnBybyIsImlhdCI6MTc2MTQ4NjQ1Mn0.Aq8GLrMDePDKSjtWE2r7c2wIQR0y0AboHmWXzjMC5pA"
  if (token) {
    config.headers['token'] = `${token}`;
  }
  return config;
});

export default axiosInstance;