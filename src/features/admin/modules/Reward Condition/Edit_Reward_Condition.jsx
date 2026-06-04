import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Reward_Condition_Form from "./Reward_Condition_Form";
import { Reward_Condition_API } from "./api";

export default function Edit_Reward_Condition() {

    const navigate = useNavigate();
    const Reward_Condition_Id = sessionStorage.getItem("edit_Reward_Condition_id");

    const [form, setForm] = useState({
        id: "",
        name: "",
        display_name: "",
        is_active: "",
    });

    const [errors, setErrors] = useState({});

    // 🔥 LOAD DATA
    useEffect(() => {

        if (!Reward_Condition_Id) {
            navigate("/admin/Reward-Condition");
            return;
        }

        Reward_Condition_API.getById(Reward_Condition_Id)
            .then(res => {
                setForm({
                    id: res.data.id || "",
                    name: res.data.name || "",
                    display_name: res.data.display_name || "",
                    is_active: res.data.is_active || "",
                });
            })
            .catch(() => {
                alert("Failed to load data");
            });

    }, [Reward_Condition_Id, navigate]);

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

    // 🔥 SUBMIT UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            await Reward_Condition_API.update_1(Reward_Condition_Id, form);

            sessionStorage.setItem(
                "success_message",
                "Reward Condition Updated Successfully!"
            );

            navigate("/admin/Reward-Condition");

        } catch (err) {
            setErrors(err.response?.data || {});
        }
    };

    return (
        <Reward_Condition_Form
            headingText="Edit Reward Condition"
            headingIcon="fa-edit"
            breadcrumbText="Edit Reward Condition"

            isEdit={true}   // optional 

            form={form}
            errors={errors}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            submitButtonText="Update"
            submitButtonIcon="fa-edit"
        />
    );
}