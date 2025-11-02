import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Intercept every request and attach the token if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token attached to request");
    } else {
      console.log("No token found in localStorage")
    }
    return config;
  },
  (error) => {
    // Handle errors before sending request
    return Promise.reject(error);
  }
);

export default API;
