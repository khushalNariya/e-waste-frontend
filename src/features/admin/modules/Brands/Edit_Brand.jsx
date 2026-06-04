import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Brand_Form from "./Brand_Form";
import { Brand_API } from "./api";

export default function Edit_Brand() {

    const navigate = useNavigate();
    const Brand_Id = sessionStorage.getItem("edit_user_id");

    const [form, setForm] = useState({
        name: "",
    });

    const [errors, setErrors] = useState({});

    // 🔥 LOAD DATA
    useEffect(() => {

        if (!Brand_Id) {
            navigate("/admin/Brand");
            return;
        }

        Brand_API.getById(Brand_Id)
            .then(res => {
                setForm({
                    name: res.data.name || "",
                });
            })
            .catch(() => {
                alert("Failed to load data");
            });

    }, [Brand_Id, navigate]);

    // 🔥 HANDLE CHANGE
    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 🔥 SUBMIT UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            await Brand_API.update_1(Brand_Id, form);

            sessionStorage.setItem(
                "success_message",
                "Brand-Name Updated Successfully!"
            );

            navigate("/admin/Brand");

        } catch (err) {
            setErrors(err.response?.data || {});
        }
    };

    return (
        <Brand_Form
            headingText="Edit Brand-Name"
            headingIcon="fa-edit"
            breadcrumbText="Edit Brand-Name"
            
            form={form}
            errors={errors}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            submitButtonText="Update"
            submitButtonIcon="fa-edit"
        />
    );
}