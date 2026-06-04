import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EducationForm from "./Education_Form";
import { Education_API } from "./api";

export default function Edit_Education() {

    const navigate = useNavigate();
    const educationId = sessionStorage.getItem("edit_user_id");

    const [form, setForm] = useState({
        title: "",
        description: "",
        image: null,
        category: "",
        author: "",
        date: "",
        readTime: "",
        isFeatured: false,
    });

    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (!educationId) {
            navigate("/admin/Education");
            return;
        }

        Education_API.getById(educationId)
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

    }, [educationId, navigate]);

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

        else if (e.target.name === "isFeatured") {
            setForm({
                ...form,
                isFeatured: e.target.value === "true"
            });

        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await Education_API.update(educationId, form);

            sessionStorage.setItem("success_message", "Education Updated Successfully!");
            navigate("/admin/Education");

        } catch (err) {
            setErrors(err.response?.data || {});
        }
    };

    return (
        <EducationForm
            headingText="Edit Education"
            headingIcon="fa-edit"
            breadcrumbText="Edit"
            form={form}
            errors={errors}
            preview={preview}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            submitButtonText="Update Education"
            submitButtonIcon="fa-edit"
        />
    );
}
