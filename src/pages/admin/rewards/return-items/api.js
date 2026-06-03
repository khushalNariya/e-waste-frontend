import { API_Service } from "../../../../services/admin-api/API_Service";
import axiosInstance from "../../auth/jwt-auto-check/Axios_Instance";

const BASE_URL = "14___3___API__app__14__Admin_Return_Item";

export const Reward_Return_Item_API = {
    ...API_Service(BASE_URL),
    
    fetchAll: (page = 1, limit = 5, search = "", filters = {}) => {
        let url = `${BASE_URL}/?p=${page}&page_size=${limit}&search=${search}`;
        
        if (filters.return_request) url += `&return_request=${filters.return_request}`;
        
        return axiosInstance.get(url);
    }
};
