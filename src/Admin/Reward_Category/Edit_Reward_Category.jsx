import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Reward_Category_Form from "./Reward_Category_Form";
import { Reward_Category_API } from "./api";
import axiosInstance from "../JWT Auto Check/Axios_Instance";

export default function Edit_Reward_Category() {
    const navigate = useNavigate();
    const Reward_Category_Id = sessionStorage.getItem("edit_Reward_Category_id");

    const [form, setForm] = useState({
        id: "",
        name: "",
        is_active: true,
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!Reward_Category_Id) {
            navigate("/admin/Reward-Category");
            return;
        }

        Reward_Category_API.getById(Reward_Category_Id)
            .then(res => {
                setForm({
                    id: res.data.id || "",
                    name: res.data.name || "",
                    is_active: res.data.is_active || "",
                });
            })
            .catch((err) => {
                console.log("Load Data Error:", err);
                alert("Failed to load data");

            });

    }, [Reward_Category_Id, navigate]);


    // ============= handle change =============
    // 🔥 HANDLE CHANGE
    const handleChange = (e) => {

        const { name, value } = e.target;

        if (name === "is_active") {
            setForm(prev => ({
                ...prev,
                is_active: value === "true"
            }));
            setErrors(prev => ({ ...prev, is_active: "" }));
        } else {

            setForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await Reward_Category_API.update_1(Reward_Category_Id, {
                id: form.id,
                name: form.name,
                is_active: form.is_active,
            });
            sessionStorage.setItem(
                "success_message",
                "Reward Category Name Updated Successfully!"
            );
            navigate("/admin/Reward-Category");
        } catch (err) {
            setErrors(err.response?.data || {});
        }
    };

    return (
        <Reward_Category_Form
            headingText="Edit Reward Category"
            headingIcon="fa-pen-to-square"
            breadcrumbText="Edit Reward Category"
            
            isEdit={true}
            
            form={form}
            errors={errors}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            submitButtonText="Update"
            submitButtonIcon="fa-pen"
        />
    );
}