// Axios_Instance.js
import axios from "axios";
import { getTokenRemainingTime } from "./tokenTime";

const axiosInstance = axios.create({
  // Read base URL dynamically from environment variables, fallback to localhost
  baseURL: `${process.env.REACT_APP_API_URL || "http://127.0.0.1:1000/"}api/`,
});

/* ================= REQUEST ================= */
axiosInstance.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem("admin_access_token");
    const refresh = localStorage.getItem("admin_refresh_token");

    if (access) {
      const time = getTokenRemainingTime(access);
      console.log(
        `🟢 ACCESS TOKEN: ${time.minutes} min ${time.seconds % 60} sec left`
      );

      config.headers.Authorization = `Bearer ${access}`;
    }

    if (refresh) {
      const time = getTokenRemainingTime(refresh);
      console.log(
        `🔵 REFRESH TOKEN: ${time.minutes} min ${time.seconds % 60} sec left`
      );
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE ================= */
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // 🔴 Access token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("admin_refresh_token");

        if (!refresh) {
          localStorage.clear();
          window.location.href = "/admin/";
          return;
        }

        // 🔁 Refresh token call
        const res = await axios.post(
          // Read token refresh URL dynamically from environment variables
          `${process.env.REACT_APP_API_URL || "http://127.0.0.1:1000/"}api/token/refresh/`,
          { refresh }
        );

        // ✅ New access token save
        localStorage.setItem("admin_access_token", res.data.access);

        // 🔁 Retry original API
        originalRequest.headers.Authorization =
          "Bearer " + res.data.access;

        return axiosInstance(originalRequest);

      } catch (err) {
        console.log("🔴 Refresh token expired");
        localStorage.clear();
        window.location.href = "/admin/";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;