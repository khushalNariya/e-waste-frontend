import { API_Service } from "../API/API_Service";
import axiosInstance from "../JWT Auto Check/Axios_Instance";

const BASE_URL = "15___3___API__app__15__Admin_Replace_Item";

export const Reward_Replace_Item_API = {
    ...API_Service(BASE_URL),

    fetchAll: (page = 1, limit = 5, search = "", filters = {}) => {
        let url = `${BASE_URL}/?p=${page}&page_size=${limit}&search=${search}`;

        if (filters.replace_request) url += `&replace_request=${filters.replace_request}`;

        return axiosInstance.get(url);
    }
};
