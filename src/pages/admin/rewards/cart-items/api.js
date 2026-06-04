import { API_Service } from "../../../../services/admin-api/API_Service";
import axiosInstance from "../../auth/jwt-auto-check/Axios_Instance";

const BASE_URL = "12___2___API__app__12__Reward_Cart_Items";

export const Reward_Cart_Items_API = {
    ...API_Service(BASE_URL),
    
    // Override fetchAll if needed
    fetchAll: (page = 1, limit = 5, search = "", filters = {}) => {
        let url = `${BASE_URL}/?p=${page}&page_size=${limit}&search=${search}`;
        
        if (filters.cart) url += `&cart=${filters.cart}`;
        if (filters.product) url += `&product=${filters.product}`;
        if (filters.user) url += `&user=${filters.user}`;
        if (filters.category) url += `&category=${filters.category}`;
        
        return axiosInstance.get(url);
    }
};
