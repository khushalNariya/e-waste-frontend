import axios from "axios";

export const fetchFacilities = () => {
  return axios.get(`${process.env.REACT_APP_API_URL || "http://127.0.0.1:1000/"}api/facilities/`);
};