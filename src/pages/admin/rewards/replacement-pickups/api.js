import { API_Service } from "../../../../services/admin-api/API_Service";
import axiosInstance from "../../auth/jwt-auto-check/Axios_Instance";

const BASE_URL = "15___4___API__app__15__Admin_Replace_Pickup";

export const Reward_Replace_Pickup_API = {
    ...API_Service(BASE_URL),

    fetchAll: (page = 1, limit = 5, search = "", filters = {}) => {
        let url = `${BASE_URL}/?p=${page}&page_size=${limit}&search=${search}`;

        if (filters.pickup_status) url += `&pickup_status=${filters.pickup_status}`;
        if (filters.replace_request) url += `&replace_request=${filters.replace_request}`;

        return axiosInstance.get(url);
    }
};
