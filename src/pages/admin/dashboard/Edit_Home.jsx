import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HowItWorksForm from "./Home_Form";
import { Home_API } from "./api";

export default function Edit_HowItWorks() {

    const navigate = useNavigate();
    const howItWorksId = sessionStorage.getItem("edit_user_id");

    const [form, setForm] = useState({
        title: "",
        description: "",
        icon: "",
        order: 0,
        is_active: true,
    });

    const [errors, setErrors] = useState({});

    // 🔥 LOAD DATA
    useEffect(() => {

        if (!howItWorksId) {
            navigate("/admin/Home");
            return;
        }

        Home_API.getById(howItWorksId)
            .then(res => {
                setForm({
                    title: res.data.title || "",
                    description: res.data.description || "",
                    icon: res.data.icon || "",
                    order: res.data.order || 0,
                    is_active: res.data.is_active ?? true,
                });
            })
            .catch(() => {
                alert("Failed to load data");
            });

    }, [howItWorksId, navigate]);

    // 🔥 HANDLE CHANGE
    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: name === "is_active"
                ? value === "true"
                : value
        }));
    };

    // 🔥 SUBMIT UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            await Home_API.update_1(howItWorksId, form);

            sessionStorage.setItem(
                "success_message",
                "How It Works Updated Successfully!"
            );

            navigate("/admin/Home");

        } catch (err) {
            setErrors(err.response?.data || {});
        }
    };

    return (
        <HowItWorksForm
            headingText="Edit How It Works"
            headingIcon="fa-edit"
            breadcrumbText="Edit Home"
            form={form}
            errors={errors}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            submitButtonText="Update"
            submitButtonIcon="fa-edit"
        />
    );
}