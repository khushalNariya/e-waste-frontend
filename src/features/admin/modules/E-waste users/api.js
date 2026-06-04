import axiosInstance from "../JWT Auto Check/Axios_Instance";

const ENDPOINT = "1___API__app__1__User_Register/";

// GET USERS
export const fetch_Users = (page, limit, search) => {
  return axiosInstance.get(`${ENDPOINT}?p=${page}&page_size=${limit}&search=${search}`);
};

// POST
export const create_User = (data) => {
  return axiosInstance.post(ENDPOINT, data);
};

// GET( USER BY ID)
export const get_User_By_Id = (id) => {
  return axiosInstance.get(`${ENDPOINT}${id}/`);
};

// UPDATE USER (PUT / PATCH)
export const update_User = (id, data) => {
  return axiosInstance.put(`${ENDPOINT}${id}/`, data);
};

// DELETE USER
export const delete_User = (id) => {
  return axiosInstance.delete(`${ENDPOINT}${id}/`);
};
