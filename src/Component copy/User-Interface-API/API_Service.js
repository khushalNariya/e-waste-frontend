import axiosInstance from "./axiosInstance";

export const getEducation_Blogs = () => {
    return axiosInstance.get("User-api/education/");
};

export const getEducationDetails = (slug) => {
   return axiosInstance.get(`User-api/education/${slug}/`)
}