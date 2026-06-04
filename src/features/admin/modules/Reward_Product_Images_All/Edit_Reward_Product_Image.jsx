import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Reward_Product_Image_API, Reward_Product_API } from "./api";
import Reward_Product_Image_Form from "./Reward_Product_Image_Form";

export default function Edit_Reward_Product_Image() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        id: "",
        product_id: "",
        image: null,
        is_primary: false,
        display_order: 1,
        is_active: true,
    });
    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const id = sessionStorage.getItem("edit_Reward_Product_Image_id");
        if (!id) {
            navigate("/admin/Reward-Product-Image");
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch products for dropdown
                const prodRes = await Reward_Product_API.fetchAll(1, 1000);
                setProducts(prodRes.data.results || []);

                // Fetch current image data
                const res = await Reward_Product_Image_API.getById(id);
                const data = res.data;
                setForm({
                    id: data.id,
                    product_id: data.product ? data.product.id : "",
                    image: data.image, // URL for display
                    is_primary: data.is_primary,
                    display_order: data.display_order,
                    is_active: data.is_active,
                });
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, [navigate]);

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
        setForm((prev) => ({ ...prev, new_image: file }));
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
        if (form.new_image) formData.append("image", form.new_image);
        formData.append("is_primary", form.is_primary);
        formData.append("display_order", form.display_order);
        formData.append("is_active", form.is_active);

        try {
            await Reward_Product_Image_API.update_1(form.id, formData);
            sessionStorage.setItem("success_message", "Product image updated successfully!");
            navigate("/admin/Reward-Product-Image");
        } catch (err) {
            if (err.response && err.response.data) {
                setErrors(err.response.data);
            } else {
                console.error("Update error:", err);
            }
        }
    };

    return (
        <Reward_Product_Image_Form
            headingText="Edit Product Image"
            headingIcon="fa-edit"
            breadcrumbText="Edit Image"
            isEdit={true}
            form={form}
            errors={errors}
            products={products}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            submitButtonText="Update Image Data"
            submitButtonIcon="fa-save"
            preview={preview}
        />
    );
}
