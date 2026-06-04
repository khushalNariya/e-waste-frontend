import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { update_User, get_User_By_Id } from "./api";

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
        <div className="admin-content mt-4">

            {/* HEADER */}
            <div className="page-header d-flex justify-content-between align-items-center mt-4 mb-3 flex-wrap">
                <div>
                    <h4 className="fw-bold text-primary mb-1">
                        <i className="fa fa-edit me-2"></i> Edit User
                    </h4>

                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="/admin">Dashboard</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link to="/admin/Users_2">Users</Link>
                            </li>
                            <li className="breadcrumb-item active">Edit</li>
                        </ol>
                    </nav>
                </div>

                <span className="badge bg-secondary">Admin Panel</span>
            </div>

            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
            {successMsg && <div className="alert alert-success">{successMsg}</div>}

            <div className="row justify-content-center">
                <div className="col-lg-9">

                    <div className="card shadow-sm">
                        <div className="card-body">

                            <form onSubmit={handleSubmit}>

                                {/* NAME */}
                                <div className="row mb-3">

                                    <div className="col-md-6">
                                        <label>First Name</label>
                                        <input
                                            name="first_name"
                                            value={form.first_name}
                                            onChange={handleChange}
                                            className={`form-control ${errors.first_name && "is-invalid"}`}
                                        />
                                        {errors.first_name &&
                                            <div className="invalid-feedback">
                                                {Array.isArray(errors.first_name) ? errors.first_name[0] : errors.first_name}
                                            </div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label>Last Name</label>
                                        <input
                                            name="last_name"
                                            value={form.last_name}
                                            onChange={handleChange}
                                            className={`form-control ${errors.last_name && "is-invalid"}`}
                                        />
                                        {errors.last_name &&
                                            <div className="invalid-feedback">
                                                {Array.isArray(errors.last_name) ? errors.last_name[0] : errors.last_name}
                                            </div>}
                                    </div>

                                </div>

                                {/* EMAIL + MOBILE */}
                                <div className="row mb-3">

                                    <div className="col-md-6">
                                        <label>Email</label>
                                        <input
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            className={`form-control ${errors.email && "is-invalid"}`}
                                        />
                                        {errors.email &&
                                            <div className="invalid-feedback">
                                                {Array.isArray(errors.email) ? errors.email[0] : errors.email}
                                            </div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label>Mobile</label>
                                        <input
                                            name="mobile_number"
                                            value={form.mobile_number}
                                            onChange={handleChange}
                                            className={`form-control ${errors.mobile_number && "is-invalid"}`}
                                        />
                                        {errors.mobile_number &&
                                            <div className="invalid-feedback">
                                                {Array.isArray(errors.mobile_number) ? errors.mobile_number[0] : errors.mobile_number}
                                            </div>}
                                    </div>

                                </div>

                                {/* ADDRESS */}
                                <div className="mb-3">
                                    <label>Address Line 1</label>
                                    <input
                                        name="address_line_1"
                                        value={form.address_line_1}
                                        onChange={handleChange}
                                        className={`form-control ${errors.address_line_1 && "is-invalid"}`}
                                    />
                                    {errors.address_line_1 &&
                                        <div className="invalid-feedback">
                                            {Array.isArray(errors.address_line_1) ? errors.address_line_1[0] : errors.address_line_1}
                                        </div>}
                                </div>

                                <div className="mb-3">
                                    <label>Address Line 2</label>
                                    <input
                                        name="address_line_2"
                                        value={form.address_line_2}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>

                                {/* CITY STATE PIN */}
                                <div className="row mb-3">

                                    <div className="col-md-4">
                                        <label>City</label>
                                        <input
                                            name="city"
                                            value={form.city}
                                            onChange={handleChange}
                                            className={`form-control ${errors.city && "is-invalid"}`}
                                        />

                                        {errors.city && (
                                            <div className="invalid-feedback">
                                                {Array.isArray(errors.city) ? errors.city[0] : errors.city}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-4">
                                        <label>State</label>
                                        <input
                                            name="state"
                                            value={form.state}
                                            onChange={handleChange}
                                            className={`form-control ${errors.state && "is-invalid"}`}
                                        />

                                        {errors.state && (
                                            <div className="invalid-feedback">
                                                {Array.isArray(errors.state) ? errors.state[0] : errors.state}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-4">
                                        <label>Pincode</label>
                                        <input
                                            name="pincode"
                                            value={form.pincode}
                                            onChange={handleChange}
                                            className={`form-control ${errors.pincode && "is-invalid"}`}
                                        />

                                        {errors.pincode && (
                                            <div className="invalid-feedback">
                                                {Array.isArray(errors.pincode) ? errors.pincode[0] : errors.pincode}
                                            </div>
                                        )}
                                    </div>

                                </div>

                                {/* PASSWORD */}
                                <div className="row mb-4">

                                    <div className="col-md-6 position-relative">
                                        <label>Password</label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            className={`form-control ${errors.password && "is-invalid"}`}
                                        />
                                        {errors.password && (
                                            <div className="invalid-feedback">
                                                {errors.password[0]}
                                            </div>
                                        )}

                                        <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"} password-toggle`}
                                            onClick={() => setShowPassword(!showPassword)}></i>
                                    </div>

                                    <div className="col-md-6 position-relative">
                                        <label>Confirm Password</label>
                                        <input
                                            type={showConfirm ? "text" : "password"}
                                            name="confirmPassword"
                                            value={form.confirmPassword}
                                            onChange={handleChange}
                                            className={`form-control ${errors.confirmPassword && "is-invalid"}`}
                                        />
                                        {errors.confirmPassword && (
                                            <div className="invalid-feedback">
                                                {errors.confirmPassword[0]}
                                            </div>
                                        )}
                                        <i className={`fa ${showConfirm ? "fa-eye-slash" : "fa-eye"} password-toggle`}
                                            onClick={() => setShowConfirm(!showConfirm)}></i>
                                    </div>

                                </div>

                                <button type="submit" className="btn btn-primary w-100">
                                    Update User
                                </button>

                            </form>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
