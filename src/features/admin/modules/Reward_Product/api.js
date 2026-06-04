import { API_Service } from "../API/API_Service";
import axiosInstance from "../JWT Auto Check/Axios_Instance";

const BASE_URL = "9___2___API__app__9__Reward_Product";

export const Reward_Product_API = {
    ...API_Service(BASE_URL),
    
    // Override fetchAll to support category and status filters
    fetchAll: (page = 1, limit = 5, search = "", filters = {}) => {
        let url = `${BASE_URL}/?p=${page}&page_size=${limit}&search=${search}`;
        
        if (filters.category) url += `&category=${filters.category}`;
        
        return axiosInstance.get(url);
    }
};

export const Reward_Category_API = API_Service("9___1___API__app__9__Reward_Category");

