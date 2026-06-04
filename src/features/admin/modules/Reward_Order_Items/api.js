import { API_Service } from "../API/API_Service";
import axiosInstance from "../JWT Auto Check/Axios_Instance";

const BASE_URL = "13___2___API__app__13__Reward_Order_Items";

export const Reward_Order_Items_API = {
    ...API_Service(BASE_URL),
    
    fetchAll: (page = 1, limit = 5, search = "", filters = {}) => {
        let url = `${BASE_URL}/?p=${page}&page_size=${limit}&search=${search}`;
        
        if (filters.order) url += `&order=${filters.order}`;
        if (filters.product_name) url += `&product_name=${filters.product_name}`;
        
        return axiosInstance.get(url);
    }
};
