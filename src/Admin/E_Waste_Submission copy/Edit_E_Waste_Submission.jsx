import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import E_Waste_Submission_Form from "./E_Waste_Submission_Form";
import { E_Waste_Submission_API } from "./E_Waste_Submission_api";
import axiosInstance from "../JWT Auto Check/Axios_Instance";
import { Reward_Condition_API } from "../Reward Condition/api";
import { Recycling_info_API } from "../Category -- Recycling Info/api";

export default function Edit_E_Waste_Submission() {
    const navigate = useNavigate();
    const E_Waste_Submission_Id = sessionStorage.getItem("edit_E_Waste_Submission_id");

    const [form, setForm] = useState({
        id: "",
        category_id: "",
        category_brand_mapping_id: "",
        model_id: "",
        user_condition_id: "",
        final_condition_id: "",
        facility_id: "",
        pickup_type: "",
        address: "",
        pickup_date: "",
        pickup_time: "",
        phone: "",
        notes: "",
        status: "",
    });

    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [conditions, setConditions] = useState([]);
    const [facilities, setFacilities] = useState([]);

    useEffect(() => {
        if (!E_Waste_Submission_Id) {
            navigate("/admin/E-Waste-Submission");
            return;
        }

        const loadData = async () => {
            try {
                // 1. Fetch Categories
                const catRes = await Recycling_info_API.fetchAll(1, 100);
                setCategories(catRes.data.results || catRes.data);

                // 2. Fetch Conditions
                const condRes = await Reward_Condition_API.fetchAll();
                setConditions(condRes.data.results || condRes.data);

                // 3. Fetch Facilities
                const facRes = await axiosInstance.get("facilities/");
                setFacilities(facRes.data.results || facRes.data);

                // 4. Submission details
                const subRes = await E_Waste_Submission_API.getById(E_Waste_Submission_Id);
                const sub = subRes.data;

                // 5. Fetch Dependent Brands
                if (sub.category?.id) {
                    const brandRes = await axiosInstance.get(
                        `http://127.0.0.1:1000/User-api/Category_Wise_Brand_Filter/?category_id=${sub.category.id}`
                    );
                    setBrands(brandRes.data.results || brandRes.data);
                }

                // 6. Fetch Dependent Models
                if (sub.category_brand_mapping?.id) {
                    const modelRes = await axiosInstance.get(
                        `http://127.0.0.1:1000/User-api/Category_Wise_Brand_Wise_Model_Filter/?category_brand_mapping_id=${sub.category_brand_mapping.id}`
                    );
                    setModels(modelRes.data.results || modelRes.data);
                }

                setForm({
                    id: sub.id || "",
                    category_id: sub.category?.id || "",
                    category_brand_mapping_id: sub.category_brand_mapping?.id || "",
                    model_id: sub.model?.id || "",
                    user_condition_id: sub.user_condition?.id || "",
                    final_condition_id: sub.final_condition?.id || "",
                    facility_id: sub.facility?.id || "",
                    pickup_type: sub.pickup_type || "pickup",
                    address: sub.address || "",
                    pickup_date: sub.pickup_date || "",
                    pickup_time: sub.pickup_time || "",
                    phone: sub.phone || "",
                    notes: sub.notes || "",
                    status: sub.status || "Requested",
                });
            } catch (err) {
                console.log("Load Data Error:", err);
                alert("Failed to load data");
            }
        };

        loadData();
    }, [E_Waste_Submission_Id, navigate]);

    // ============= handle change =============
    const handleChange = async (e) => {
        const { name, value } = e.target;

        if (name === "category_id") {
            setForm(prev => ({
                ...prev,
                category_id: value,
                category_brand_mapping_id: "",
                model_id: ""
            }));
            setBrands([]);
            setModels([]);

            if (value) {
                try {
                    const res = await axiosInstance.get(
                        `http://127.0.0.1:1000/User-api/Category_Wise_Brand_Filter/?category_id=${value}`
                    );
                    setBrands(res.data.results || res.data);
                } catch (err) {
                    console.log("Brand fetch error", err);
                }
            }
        } else if (name === "category_brand_mapping_id") {
            setForm(prev => ({
                ...prev,
                category_brand_mapping_id: value,
                model_id: ""
            }));
            setModels([]);

            if (value) {
                try {
                    const res = await axiosInstance.get(
                        `http://127.0.0.1:1000/User-api/Category_Wise_Brand_Wise_Model_Filter/?category_brand_mapping_id=${value}`
                    );
                    setModels(res.data.results || res.data);
                } catch (err) {
                    console.log("Model fetch error", err);
                }
            }
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }

        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await E_Waste_Submission_API.update_1(E_Waste_Submission_Id, form);
            sessionStorage.setItem("success_message", "E-Waste Submission Updated Successfully!");
            navigate("/admin/E-Waste-Submission");
        } catch (err) {
            setErrors(err.response?.data || {});
        }
    };

    return (
        <E_Waste_Submission_Form
            headingText="Edit E-Waste Submission"
            headingIcon="fa-pen-to-square"
            breadcrumbText="Edit E-Waste Submission"
            isEdit={true}
            categories={categories}
            brands={brands}
            models={models}
            conditions={conditions}
            facilities={facilities}
            form={form}
            errors={errors}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            submitButtonText="Update Submission"
            submitButtonIcon="fa-save"
        />
    );
}