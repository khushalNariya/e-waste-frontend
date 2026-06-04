import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import E_Waste_Submission_Form from "./E_Waste_Submission_Form";
import { E_Waste_Submission_API } from "./E_Waste_Submission_api";
import axiosInstance from "../../auth/jwt-auto-check/Axios_Instance";
import { Reward_Condition_API } from "../../rewards/conditions/api";
import { Recycling_info_API } from "../recycling-info/api";
import { Reward_Rules_API } from "../../rewards/rules/api";

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
        images: [],
        weight: "",
    });

    const [errors, setErrors] = useState({});
    const [errorMsg, setErrorMsg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [conditions, setConditions] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState("");
    const [rewardRules, setRewardRules] = useState([]);

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

                // 4. Fetch Reward Rules
                const rulesRes = await Reward_Rules_API.fetchAll(1, 1000);
                const rulesData = rulesRes.data.results || rulesRes.data;
                setRewardRules(rulesData);

                // 5. Submission details
                const subRes = await E_Waste_Submission_API.getById(E_Waste_Submission_Id);
                const sub = subRes.data;

                // 6. Fetch Dependent Brands
                if (sub.category?.id) {
                    const matchingRule = rulesData.find(rule => String(rule.category?.id) === String(sub.category.id));
                    if (matchingRule) {
                        setSelectedUnit(matchingRule.unit?.toLowerCase() || "");
                    }

                    const brandRes = await axiosInstance.get(
                        `${(process.env.REACT_APP_API_URL || "http://127.0.0.1:1000/").replace(/\/$/, "")}/User-api/Category_Wise_Brand_Filter/?category_id=${sub.category.id}`
                    );
                    setBrands(brandRes.data.results || brandRes.data);
                }

                // 7. Fetch Dependent Models
                if (sub.category_brand_mapping?.id) {
                    const modelRes = await axiosInstance.get(
                        `${(process.env.REACT_APP_API_URL || "http://127.0.0.1:1000/").replace(/\/$/, "")}/User-api/Category_Wise_Brand_Wise_Model_Filter/?category_brand_mapping_id=${sub.category_brand_mapping.id}`
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
                    status: sub.status || "requested",
                    weight: sub.weight || "",
                    images: Array.isArray(sub.images_data)
                        ? sub.images_data
                        : Object.values(sub.images_data || {}),
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

        if (name === "images") {
            const newFiles = Array.from(value);
            setForm(prev => ({
                ...prev,
                images: [...(prev.images || []), ...newFiles]
            }));
            setErrors(prev => ({ ...prev, images: "", error: "" }));
            return;
        }

        if (name === "category_id") {
            const matchingRule = rewardRules.find(rule => String(rule.category?.id) === String(value));
            if (matchingRule) {
                setSelectedUnit(matchingRule.unit?.toLowerCase() || "");
            } else {
                setSelectedUnit("");
            }

            setForm(prev => ({
                ...prev,
                category_id: value,
                category_brand_mapping_id: "",
                model_id: "",
                weight: ""
            }));
            setBrands([]);
            setModels([]);

            if (value) {
                try {
                    const res = await axiosInstance.get(
                        `${(process.env.REACT_APP_API_URL || "http://127.0.0.1:1000/").replace(/\/$/, "")}/User-api/Category_Wise_Brand_Filter/?category_id=${value}`
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
                        `${(process.env.REACT_APP_API_URL || "http://127.0.0.1:1000/").replace(/\/$/, "")}/User-api/Category_Wise_Brand_Wise_Model_Filter/?category_brand_mapping_id=${value}`
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

    const handleRemoveImage = (index) => {
        setForm(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setErrors({});
        setIsSubmitting(true);

        try {
            const formData = new FormData();

            // 🔹 normal fields
            Object.keys(form).forEach(key => {
                if (key !== "images") {
                    formData.append(key, form[key]);
                }
            });

            // 🔹 images append
            if (form.images) {
                form.images.forEach(img => {
                    // Only append if it's a new File object
                    // For existing images (from DB), we might need a separate logic 
                    // or the backend should handle maintaining existing ones.
                    // But usually, common pattern is to send all files if updated.
                    if (img instanceof File) {
                        formData.append("images", img);
                    } else if (img && img.image) {
                        // If it's an existing image object, we might want to tell the backend 
                        // but here we just append the files.
                    }
                });
            }

            // Note: Patch or Put based on ViewSet. partial=True is set in ViewSet.update
            await axiosInstance.patch(
                `10___API__app__10__E_Waste_Submission/${E_Waste_Submission_Id}/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            sessionStorage.setItem("success_message", "E-Waste Submission Updated Successfully!");
            navigate("/admin/E-Waste-Submission");
        } catch (err) {
            console.log("ERROR RESPONSE:", err.response?.data);
            if (err.response?.data) {
                setErrors(err.response.data);
            } else {
                setErrorMsg("Failed to update submission!");
            }
        } finally {
            setIsSubmitting(false);
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
            errorMsg={errorMsg}
            isSubmitting={isSubmitting}
            handleChange={handleChange}
            handleRemoveImage={handleRemoveImage}
            handleSubmit={handleSubmit}
            submitButtonText="Update Submission"
            submitButtonIcon="fa-save"
            selectedUnit={selectedUnit}
        />
    );
}
