import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Recycling_info_Form from "./Recycling_info_Form";
import { Recycling_info_API } from "./api";

export default function Edit_Recycling_info() {

    const navigate = useNavigate();
    const Recycling_info_Id = sessionStorage.getItem("edit_user_id");

    const [form, setForm] = useState({
        title: "",
        description: "",
        process: "",
        instruction: "",
        benefits: "",
        button_text: "",
        icon: ""

    });

    const [errors, setErrors] = useState({});

    const [steps, setSteps] = useState([]);

    // 🔥 LOAD DATA
    useEffect(() => {

        if (!Recycling_info_Id) {
            navigate("/admin/Recycling-info");
            return;
        }

        Recycling_info_API.getById(Recycling_info_Id)
            .then(res => {
                setForm({
                    title: res.data.title || "",
                    description: res.data.description || "",
                    process: res.data.process || "",
                    instruction: res.data.instruction || "",
                    benefits: res.data.benefits || "",
                    button_text: res.data.button_text || "",
                    icon: res.data.icon || ""
                });

                const data = res.data;

                // 🔥 IMPORTANT (process → steps)
                const splitSteps = data.process
                    ? data.process.split("→").map(s => s.trim())
                    : ["", "", ""];

                setSteps(splitSteps);

            })
            .catch(() => {
                alert("Failed to load data");
            });

    }, [Recycling_info_Id, navigate]);

    // ================= Process (Field) INPUT CHANGE =================
    const handleStepChange = (index, value) => {
        const newSteps = [...steps];
        newSteps[index] = value;
        setSteps(newSteps);

        setErrors(prev => ({ ...prev, process: "" }));
    };

    // ======== add - Step (Process)
    const addStep = () => {
        setSteps([...steps, ""]);
    };

    // 🔥 HANDLE CHANGE
    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm(prev => ({ ...prev, [name]: value }));

        // remove error when typing
        setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    };

    // 🔥 SUBMIT UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();


        // steps → string
        const formattedProcess = steps
            .map(s => s.trim())
            .filter(s => s)
            .join("\n");

        const finalData = {
            ...form,
            process: formattedProcess
        };

        try {

            await Recycling_info_API.update_1(Recycling_info_Id, finalData);

            sessionStorage.setItem("success_message", "Recycling Info Updated Successfully!");

            navigate("/admin/Recycling-info");

        } catch (err) {
            setErrors(err.response?.data || {});
        }
    };

    return (
        <Recycling_info_Form
            headingText="Edit Recycling Info"
            headingIcon="fa-edit"
            breadcrumbText="Edit Recycling Info"

            form={form}
            errors={errors}
            handleChange={handleChange}
            handleSubmit={handleSubmit}

            steps={steps}
            handleStepChange={handleStepChange}
            addStep={addStep}

            submitButtonText="Update"
            submitButtonIcon="fa-edit"
        />
    );
}