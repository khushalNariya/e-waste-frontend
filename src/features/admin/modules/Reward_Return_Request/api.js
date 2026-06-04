import { API_Service } from "../API/API_Service";
import axiosInstance from "../JWT Auto Check/Axios_Instance";

const BASE_URL = "14___1___API__app__14__Admin_Return_Request";

export const Reward_Return_Request_API = {
    ...API_Service(BASE_URL),
    
    fetchAll: (page = 1, limit = 5, search = "", filters = {}) => {
        let url = `${BASE_URL}/?p=${page}&page_size=${limit}&search=${search}`;
        
        if (filters.user) url += `&user=${filters.user}`;
        if (filters.status) url += `&return_status=${filters.status}`;
        
        return axiosInstance.get(url);
    }
};
