import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import E_Waste_Status_History_Form from "./E_Waste_Status_History_Form";
import { E_Waste_Status_History_API } from "./E_Waste_Status_History_api";

export default function Edit_E_Waste_Status_History() {
    const navigate = useNavigate();
    const History_Id = sessionStorage.getItem("edit_E_Waste_Status_History_id");

    const [form, setForm] = useState({
        id: "",
        submission: "",
        status: "",
        remarks: "",
        product: null,
        user: null,
        changed_by: null,
        created_at: ""
    });

    const [errors, setErrors] = useState({});
    const [errorMsg, setErrorMsg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!History_Id) {
            navigate("/admin/E-Waste-Status-History");
            return;
        }

        const loadData = async () => {
            try {
                const res = await E_Waste_Status_History_API.getById(History_Id);
                const data = res.data;
                
                setForm({
                    id: data.id || "",
                    submission: data.submission || "",
                    status: data.status || "",
                    remarks: data.remarks || "",
                    product: data.product || null,
                    user: data.user || null,
                    changed_by: data.changed_by || null,
                    created_at: data.created_at || ""
                });
            } catch (err) {
                console.log("Load Data Error:", err);
                alert("Failed to load history record");
                navigate("/admin/E-Waste-Status-History");
            }
        };

        loadData();
    }, [History_Id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setErrors({});
        setIsSubmitting(true);

        try {
            // Only sending remarks as per backend update logic
            await E_Waste_Status_History_API.patch(History_Id, {
                remarks: form.remarks
            });




            sessionStorage.setItem("success_message", "Status History Remarks Updated!");
            navigate("/admin/E-Waste-Status-History");
        } catch (err) {
            console.log("ERROR RESPONSE:", err.response?.data);
            if (err.response?.data) {
                setErrors(err.response.data);
            } else {
                setErrorMsg("Failed to update remarks!");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <E_Waste_Status_History_Form
            headingText="Update Status Remarks"
            headingIcon="fa-pen-nib"
            breadcrumbText="Update History"
            form={form}
            errors={errors}
            errorMsg={errorMsg}
            isSubmitting={isSubmitting}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            submitButtonText="Save Changes"
            submitButtonIcon="fa-save"
        />
    );
}
