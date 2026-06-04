import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Home_Hero_Image_Form from "./Home_Hero_Image_Form";
import { Home_Hero_Image_API } from "./api";

export default function Edit_Home_Hero_Image() {

    const navigate = useNavigate();
    const Hero_image_id = sessionStorage.getItem("edit_user_id");

    const [form, setForm] = useState({
        
        image: null,
        is_active: false,
    
    });

    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (!Hero_image_id) {
            navigate("/admin/Home-Hero-Image");
            return;
        }

        Home_Hero_Image_API.getById(Hero_image_id)
            .then(res => {
                setForm({
                    ...res.data,
                    image: null
                });
                setPreview(res.data.image);
            })
            .catch(() => {
                alert("Failed to load data");
            });

    }, [Hero_image_id, navigate]);

    const handleChange = (e) => {
        if (e.target.type === "file") {
            const file = e.target.files[0];
            setForm({ ...form, image: file });

            if (file) {
                setPreview(URL.createObjectURL(file));  // 👈 NEW IMAGE PREVIEW
            }
        }
        // else if (e.target.type === "checkbox") {
        //     setForm({ ...form, [e.target.name]: e.target.checked });

        else if (e.target.name === "is_active") {
            setForm({
                ...form,
                is_active: e.target.value === "true"
            });

        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await Home_Hero_Image_API.update(Hero_image_id, form);

            sessionStorage.setItem("success_message", "Hero Image Updated Successfully!");
            navigate("/admin/Home-Hero-Image");

        } catch (err) {
            setErrors(err.response?.data || {});
        }
    };

    return (
        <Home_Hero_Image_Form
            headingText="Edit Hero Image"
            headingIcon="fa-edit"
            breadcrumbText="Edit"
            form={form}
            errors={errors}
            preview={preview}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            submitButtonText="Update Hero Image"
            submitButtonIcon="fa-edit"
        />
    );
}
