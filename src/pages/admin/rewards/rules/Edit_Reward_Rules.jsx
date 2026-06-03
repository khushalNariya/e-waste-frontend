import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Reward_Rules_Form from "./Reward_Rules_Form";
import { Reward_Rules_API } from "./api";
import { Recycling_info_API } from "../../e-waste/recycling-info/api";
import { Reward_Condition_API } from "../conditions/api";

export default function Edit_Reward_Rules() {

    const navigate = useNavigate();
    const Reward_Rules_Id = sessionStorage.getItem("edit_Reward_Rules_id");

    const [form, setForm] = useState({
        id: "",
        category_id: "",
        condition_id: "",
        points: "",
        unit: "",
        is_active: true,
    });

    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const [conditions, setConditions] = useState([]);

    // 🔥 LOAD DATA
    useEffect(() => {

        if (!Reward_Rules_Id) {
            navigate("/admin/Reward-Rules");
            return;
        }

        Reward_Rules_API.getById(Reward_Rules_Id)
            .then(res => {
                console.log("API DATA:", res.data);
                setForm({
                    id: res.data.id || "",
                    category_id: res.data.category.id,
                    condition_id: res.data.condition.id,
                    points: res.data.points || "",
                    // unit: res.data.unit || "",
                    unit: res.data.unit?.toLowerCase() || "",
                    is_active: res.data.is_active,
                });
            })
            .catch(() => {
                alert("Failed to load data");
            });


        // Reward Categories
        Recycling_info_API.fetchAll(1, 1000).then(res => {
            setCategories(res.data.results);
        });

        // Reward Condition
        Reward_Condition_API.fetchAll(1, 1000).then(res => {
            setConditions(res.data.results);
        });

    }, [Reward_Rules_Id, navigate]);

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
                [name]: value === "" ? null : value   // 🔥 IMPORTANT FIX
            }));
        }

        // remove error when typing
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    // 🔥 SUBMIT UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            await Reward_Rules_API.update_1(Reward_Rules_Id, form);

            sessionStorage.setItem(
                "success_message",
                "Reward Rules Updated Successfully!"
            );

            navigate("/admin/Reward-Rules");

        } catch (err) {
            setErrors(err.response?.data || {});
        }
    };

    return (
        <Reward_Rules_Form
            headingText="Edit Reward Rules"
            headingIcon="fa-pen-to-square"
            breadcrumbText="Edit Reward Rules"

            isEdit={true}   // optional 

            categories={categories}
            conditions={conditions.filter(cond => cond.is_active || cond.id === form.condition_id)}

            form={form}
            errors={errors}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            submitButtonText="Update"
            submitButtonIcon="fa-edit"
        />
    );
}