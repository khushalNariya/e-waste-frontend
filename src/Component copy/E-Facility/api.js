import axios from "axios";

export const fetchFacilities = () => {
  return axios.get("http://127.0.0.1:1000/api/facilities/");
};