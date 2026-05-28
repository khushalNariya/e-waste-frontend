import axiosInstance from "../JWT Auto Check/Axios_Instance";

export const API_Service = (endpoint) => {

  const BASE = `${endpoint}/`;

  return {

    fetchAll: (page = 1, limit = 5, search = "") => {
      return axiosInstance.get(`${BASE}?p=${page}&page_size=${limit}&search=${search}`);
    },

    // create: (data) => {
    //   return axiosInstance.post(BASE, data);
    // },

    create: (data) => {
      return axiosInstance.post(BASE, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
    },

    getById: (id) => {
      return axiosInstance.get(`${BASE}${id}/`);
    },

    update_1: (id,data) => {
      return axiosInstance.put(`${BASE}${id}/`, data);
    },

    update: (id, data) => {
      return axiosInstance.put(`${BASE}${id}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
    },

    patch: (id, data) => {
      return axiosInstance.patch(`${BASE}${id}/`, data);
    },

    Delete: (id) => {
      return axiosInstance.delete(`${BASE}${id}/`);
    }


  };

};
