import { API_Service } from "../API/API_Service";
import axiosInstance from "../JWT Auto Check/Axios_Instance";

const BASE_URL = "12___1___API__app__12__Reward_Cart";

export const Reward_Cart_API = {
    ...API_Service(BASE_URL),
    
    // Override fetchAll if needed, but the default should work
    fetchAll: (page = 1, limit = 5, search = "", filters = {}) => {
        let url = `${BASE_URL}/?p=${page}&page_size=${limit}&search=${search}`;
        
        if (filters.user) url += `&user=${filters.user}`;
        if (filters.status) url += `&status=${filters.status}`;
        
        return axiosInstance.get(url);
    }
};
