/* eslint-disable no-unused-vars */
import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { useNavigate, Link } from "react-router-dom";

export default function UserForm({
    headingText,    // naya
    headingIcon,    // naya
    breadcrumbText,// naya

    form,
    errors,
    handleChange,
    handleSubmit,
    showPassword,
    showConfirm,
    setShowPassword,
    setShowConfirm,
    submitButtonText,
    submitButtonIcon,   // naya

// eslint-disable-next-line no-unused-vars
}) {
    // eslint-disable-next-line no-unused-vars
    const [errorMsg, setErrorMsg] = useState("");

    const [successMsg, setSuccessMsg] = useState("");
    return (
        <div className="admin-content mt-4">

            {/* ===== PAGE HEADER ===== */}
            <div className="page-header d-flex justify-content-between align-items-center mb-3 flex-wrap">

                <div>
                    <h4 className="fw-bold text-success mb-1">
                        <i className={`fa ${headingIcon} me-2`}></i> {headingText}
                    </h4>

                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb premium-breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="/admin">
                                    <i className="fa fa-home me-1"></i> Dashboard
                                </Link>
                            </li>

                            <li className="breadcrumb-item">
                                <Link to="/admin/Users_2">
                                    <i className="fa fa-users me-1"></i> Users Management
                                </Link>
                            </li>

                            <li className="breadcrumb-item active">{breadcrumbText}</li>
                        </ol>
                    </nav>
                </div>

                <span className="badge eco-badge">Admin Panel</span>
            </div>

            {/* ===== ALERTS ===== */}
            {successMsg && <div className="alert alert-success shadow-sm">{successMsg}</div>}


            {/* ===== FORM CARD ===== */}
            <div className="row justify-content-center">
                <div className="col-lg-9 col-xl-8">

                    <div className="card shadow-sm border-0">
                        <div className="card-body">



                            <form onSubmit={handleSubmit}>

                                {/* ===== Name ===== */}
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">First Name</label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={form.first_name}
                                            onChange={handleChange}
                                            className={`form-control ${errors.first_name && "is-invalid"}`}
                                            placeholder="Enter first name"
                                        />
                                        {errors.first_name && <div className="invalid-feedback">{Array.isArray(errors.first_name) ? errors.first_name[0] : errors.first_name}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Last Name</label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={form.last_name}
                                            onChange={handleChange}
                                            className={`form-control ${errors.last_name && "is-invalid"}`}
                                            placeholder="Enter last name"
                                        />
                                        {errors.last_name && <div className="invalid-feedback">{Array.isArray(errors.last_name) ? errors.last_name[0] : errors.last_name}</div>}
                                    </div>
                                </div>

                                {/* ===== Email + Mobile ===== */}
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            className={`form-control ${errors.email && "is-invalid"}`}
                                        />
                                        {errors.email && <div className="invalid-feedback">{Array.isArray(errors.email) ? errors.email[0] : errors.email}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Mobile</label>
                                        <input
                                            type="text"
                                            name="mobile_number"
                                            value={form.mobile_number}
                                            onChange={handleChange}
                                            className={`form-control ${errors.mobile_number && "is-invalid"}`}
                                        />
                                        {errors.mobile_number && <div className="invalid-feedback">{Array.isArray(errors.mobile_number) ? errors.mobile_number[0] : errors.mobile_number}</div>}
                                    </div>
                                </div>

                                {/* ===== Address ===== */}
                                <div className="mb-3">
                                    <label className="form-label">Address Line 1</label>
                                    <input
                                        type="text"
                                        name="address_line_1"
                                        value={form.address_line_1}
                                        onChange={handleChange}
                                        className={`form-control ${errors.address_line_1 && "is-invalid"}`}
                                    />
                                    {errors.address_line_1 && <div className="invalid-feedback">{Array.isArray(errors.address_line_1) ? errors.address_line_1[0] : errors.address_line_1}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Address Line 2</label>
                                    <input
                                        type="text"
                                        name="address_line_2"
                                        value={form.address_line_2}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>

                                {/* ===== City / State / Pincode ===== */}
                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <label className="form-label">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={form.city}
                                            onChange={handleChange}
                                            className={`form-control ${errors.city && "is-invalid"}`}
                                        />
                                        {errors.city && <div className="invalid-feedback">{Array.isArray(errors.city) ? errors.city[0] : errors.city}</div>}
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={form.state}
                                            onChange={handleChange}
                                            className={`form-control ${errors.state && "is-invalid"}`}
                                        />
                                        {errors.state && <div className="invalid-feedback">{Array.isArray(errors.state) ? errors.state[0] : errors.state}</div>}
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label">Pincode</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={form.pincode}
                                            onChange={handleChange}
                                            className={`form-control ${errors.pincode && "is-invalid"}`}
                                        />
                                        {errors.pincode && <div className="invalid-feedback">{Array.isArray(errors.pincode) ? errors.pincode[0] : errors.pincode}</div>}
                                    </div>
                                </div>

                                {/* ===== Password ===== */}
                                <div className="row mb-4">
                                    <div className="col-md-6 position-relative">
                                        <label className="form-label">Password</label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            className={`form-control ${errors.password && "is-invalid"}`}
                                        />
                                        {errors.password && <div className="invalid-feedback">{errors.password[0]}</div>}
                                        <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"} password-toggle`} onClick={() => setShowPassword(!showPassword)}></i>
                                    </div>

                                    <div className="col-md-6 position-relative">
                                        <label className="form-label">Confirm Password</label>
                                        <input
                                            type={showConfirm ? "text" : "password"}
                                            name="confirmPassword"
                                            value={form.confirmPassword}
                                            onChange={handleChange}
                                            className={`form-control ${errors.confirmPassword && "is-invalid"}`}
                                        />
                                        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword[0]}</div>}
                                        <i className={`fa ${showConfirm ? "fa-eye-slash" : "fa-eye"} password-toggle`} onClick={() => setShowConfirm(!showConfirm)}></i>
                                    </div>
                                </div>

                                <button type="submit" className="add-btn w-100 py-2">
                                    <i className={`fa ${submitButtonIcon} me-1`}></i> {submitButtonText}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
