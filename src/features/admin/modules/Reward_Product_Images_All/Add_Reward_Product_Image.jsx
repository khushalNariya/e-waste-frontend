import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Reward_Product_Image_API, Reward_Product_API } from "./api";
import Reward_Product_Image_Form from "./Reward_Product_Image_Form";

export default function Add_Reward_Product_Image() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        product_id: "",
        image: null,
        is_primary: false,
        display_order: 1,
        is_active: true,
    });
    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await Reward_Product_API.fetchAll(1, 1000); // Get all products
                setProducts(res.data.results || []);
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };
        fetchProducts();
    }, []);

    // Cleanup preview URL to prevent memory leaks
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setForm((prev) => ({ ...prev, image: file }));
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const formData = new FormData();
        formData.append("product_id", form.product_id);
        if (form.image) formData.append("image", form.image);
        formData.append("is_primary", form.is_primary);
        formData.append("display_order", form.display_order);
        formData.append("is_active", form.is_active);

        try {
            await Reward_Product_Image_API.create(formData);
            sessionStorage.setItem("success_message", "Product image added successfully!");
            navigate("/admin/Reward-Product-Image");
        } catch (err) {
            if (err.response && err.response.data) {
                setErrors(err.response.data);
            } else {
                console.error("Submit error:", err);
            }
        }
    };

    return (
        <Reward_Product_Image_Form
            headingText="Add New Product Image"
            headingIcon="fa-plus-circle"
            breadcrumbText="Add Image"
            isEdit={false}
            form={form}
            errors={errors}
            products={products}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            submitButtonText="Upload Image"
            submitButtonIcon="fa-upload"
            preview={preview}
        />
    );
}
