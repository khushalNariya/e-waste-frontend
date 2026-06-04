import axios from "axios";

const BASE_URL = (process.env.REACT_APP_API_URL || "http://127.0.0.1:1000").replace(/\/$/, "");

// ================= LOGIN API =================
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/admin/login/`, {
      email,
      password,
    });

    return response.data;

  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};