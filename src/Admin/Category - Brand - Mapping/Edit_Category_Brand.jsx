import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Category_Brand_Mapping_Form from "./Category_Brand_Mapping_Form";
import { Category_Brand_Mapping_API } from "./api";
import { Recycling_info_API } from "../Category -- Recycling Info/api";
import axiosInstance from "../JWT Auto Check/Axios_Instance";

export default function Edit_Category_Brand() {

    const navigate = useNavigate();
    const mappingId = sessionStorage.getItem("edit_mapping_id");

    const [form, setForm] = useState({
        category_id: "",
        brand_id: "",
        is_active: true,
    });

    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    // 🔥 LOAD DATA
    useEffect(() => {

        if (!mappingId) {
            navigate("/admin/Category-Brand-Mapping");
            return;
        }

        Category_Brand_Mapping_API.getById(mappingId)
            .then(res => {
                setForm({
                    category_id: res.data.category.id,
                    brand_id: res.data.brand.id,
                    is_active: res.data.is_active
                });
            })
            .catch(() => {
                alert("Failed to load data");
            });

        // ✅ ALL categories
        axiosInstance.get("all-recycle-category/")
            .then(res => {
                setCategories(res.data);
            })
            .catch(err => console.log("Category Error:", err));

        // ✅ ALL brands
        axiosInstance.get(`${(process.env.REACT_APP_API_URL || "http://127.0.0.1:1000/").replace(/\/$/, "")}/User-api/all-brand-show/`)
            .then(res => {
                setBrands(res.data);   // 🔥 direct array (no pagination)
            })
            .catch(err => { console.log(err); });

    }, [mappingId, navigate]);

    // 🔥 HANDLE CHANGE
    const handleChange = (e) => {

        const { name, value } = e.target;

        if (name === "is_active") {
            setForm(prev => ({
                ...prev,
                is_active: value === "true"
            }));
        } else {

            setForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    // 🔥 SUBMIT UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            await Category_Brand_Mapping_API.update_1(mappingId, form);

            sessionStorage.setItem(
                "success_message",
                "Category Wise Brand Value Updated Successfully!"
            );

            navigate("/admin/Category-Brand-Mapping");

        } catch (err) {
            setErrors(err.response?.data || {});
        }
    };

    return (
        <Category_Brand_Mapping_Form
            headingText="Edit Category Wise Brand Value"
            headingIcon="fa-edit"
            breadcrumbText="Edit Category Wise Brand Value"

            categories={categories}
            brands={brands}

            form={form}
            errors={errors}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            submitButtonText="Update"
            submitButtonIcon="fa-edit"
        />
    );
}