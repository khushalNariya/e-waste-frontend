import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Reward_Product_API, Reward_Category_API } from "./api";
import Reward_Product_Form from "./Reward_Product_Form";

export default function Edit_Reward_Product() {
    const navigate = useNavigate();
    const productId = sessionStorage.getItem("edit_Reward_Product_id");

    const [form, setForm] = useState({
        id: "",
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

    useEffect(() => {
        if (!productId) {
            navigate("/admin/Reward-Product");
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch categories
                const catRes = await Reward_Category_API.fetchAll(1, 100);
                setCategories(catRes.data.results || []);

                // Fetch product details
                const prodRes = await Reward_Product_API.getById(productId);
                const data = prodRes.data;
                setForm({
                    id: data.id,
                    name: data.name,
                    category_id: data.category ? data.category.id : "",
                    points: data.points,
                    stock: data.stock,
                    description: data.description,
                    terms: data.terms || "",
                    tag: data.tag || "",
                    delivery_days: data.delivery_days || "",
                    rating: data.rating || 0,
                    total_redeemed: data.total_redeemed || 0,
                    is_active: data.is_active,
                });
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, [productId, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await Reward_Product_API.update(productId, form);
            sessionStorage.setItem("success_message", "Reward Product Updated Successfully!");
            navigate("/admin/Reward-Product");
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
            }
        }
    };

    return (
        <Reward_Product_Form
            headingText="Edit Reward Product"
            headingIcon="fa-edit"
            breadcrumbText="Edit Reward Product"
            isEdit={true}
            form={form}
            errors={errors}
            categories={categories}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            submitButtonText="Update Product"
            submitButtonIcon="fa-save"
        />
    );
}