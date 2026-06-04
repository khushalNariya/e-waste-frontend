import axios from "axios";

const axiosInstance = axios.create({
  // Read base URL dynamically from environment variables, fallback to localhost
  baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:1000/",
  headers: {
    "Content-Type": "application/json"
  }
});


// Request interceptor → token add
axiosInstance.interceptors.request.use((config) => {

  const token = localStorage.getItem("user_access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// Response interceptor → token refresh
axiosInstance.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config;
    // if (error.response.status === 401 && !originalRequest._retry) {
    if (error.response && error.response.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("user_refresh_token");

      try {

        const response = await axios.post(
          // Read token refresh URL dynamically from environment variables
          `${process.env.REACT_APP_API_URL || "http://127.0.0.1:1000/"}api/token/refresh/`,
          {
            refresh: refreshToken
          }
        );

        const newAccess = response.data.access;

        localStorage.setItem("user_access_token", newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return axiosInstance(originalRequest);

      } catch (err) {

        localStorage.removeItem("user_access_token");
        localStorage.removeItem("user_refresh_token");

        window.location.href = "/login";
      }

    }

    return Promise.reject(error);
  }
);

export default axiosInstance;