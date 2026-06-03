import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Reward_Product_API, Reward_Category_API } from "./api";
import Reward_Product_Form from "./Reward_Product_Form";

export default function Add_Reward_Product() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        category_id: "",

        points: 0,
        stock: 0,
        description: "",
        terms: "",
        tag: "",
        delivery_days: "",
        rating: 0,
        total_redeemed: 0,
        is_active: true,
    });

    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});

    // Fetch categories for the dropdown
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await Reward_Category_API.fetchAll(1, 100);
                setCategories(res.data.results || []);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await Reward_Product_API.create(form);
            sessionStorage.setItem("success_message", "Reward Product Added Successfully!");
            navigate("/admin/Reward-Product");
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
            }
        }
    };

    return (
        <Reward_Product_Form
            headingText="Add Reward Product"
            headingIcon="fa-gift"
            breadcrumbText="Add Reward Product"
            isEdit={false}
            form={form}
            errors={errors}
            categories={categories}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            submitButtonText="Add Product"
            submitButtonIcon="fa-plus"
        />
    );
}
