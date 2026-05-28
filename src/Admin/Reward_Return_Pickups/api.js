import { API_Service } from "../API/API_Service";
import axiosInstance from "../JWT Auto Check/Axios_Instance";

const BASE_URL = "14___4___API__app__14__Admin_Return_Pickup";

export const Reward_Return_Pickup_API = {
    ...API_Service(BASE_URL),
    
    fetchAll: (page = 1, limit = 5, search = "", filters = {}) => {
        let url = `${BASE_URL}/?p=${page}&page_size=${limit}&search=${search}`;
        
        if (filters.pickup_status) url += `&pickup_status=${filters.pickup_status}`;
        if (filters.return_request) url += `&return_request=${filters.return_request}`;
        
        return axiosInstance.get(url);
    }
};
