import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { update_User, get_User_By_Id } from "./api";
import UserForm from "./UserForm";

export default function Edit_User() {

    const navigate = useNavigate();

    const userId = sessionStorage.getItem("edit_user_id");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        mobile_number: "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        pincode: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});
    const [loaded, setLoaded] = useState(false); // 🔹 flag to prevent overwrite

    // ================= LOAD DATA =================
    useEffect(() => {

        if (!userId) {
            navigate("/admin/Users_2");
            return;
        }

        get_User_By_Id(userId)
            .then(res => {

                setForm(prev => ({
                    ...prev,

                    first_name: res.data.first_name || "",
                    last_name: res.data.last_name || "",
                    email: res.data.email || "",

                    mobile_number: res.data.profile?.mobile_number || "",
                    address_line_1: res.data.profile?.address_line_1 || "",
                    address_line_2: res.data.profile?.address_line_2 || "",
                    city: res.data.profile?.city || "",
                    state: res.data.profile?.state || "",
                    pincode: res.data.profile?.pincode || "",

                    password: res.data.profile?.Show_Password || "",
                    confirmPassword: res.data.profile?.Show_Password || ""

                    
                }));

                setLoaded(true); // 🔹 mark as loaded

            })
            .catch(() => {
                alert("Failed to load user data");
            });

    }, [userId, navigate]);

    // ================= INPUT CHANGE =================
    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

        setErrors(prev => ({
            ...prev,
            [e.target.name]: ""
        }));
    };

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {

        e.preventDefault();

        setErrors({});
        setErrorMsg("");
        setSuccessMsg("");

        try {

            await update_User(userId, form);

            sessionStorage.setItem("success_message", "User updated successfully!");
            navigate("/admin/Users_2");

        } catch (err) {

            if (err.response?.data) {

                console.log(err.response.data);
                setErrors(err.response.data);

            } else {
                setErrorMsg("Update failed!");
            }
        }
    };

    return (
        <UserForm
            headingText="Edit User"
            headingIcon="fa-user-edit"
            breadcrumbText="Edit User"

            form={form}
            errors={errors}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            showPassword={showPassword}
            showConfirm={showConfirm}
            setShowPassword={setShowPassword}
            setShowConfirm={setShowConfirm}
            submitButtonText="Update User"
            submitButtonIcon="fa-pencil-alt"   // edit ke liye


        />
    );
}
