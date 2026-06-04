import React from "react";
import { Link } from "react-router-dom";

export default function HowItWorksForm({
    headingText,
    headingIcon,
    breadcrumbText,
    form,
    errors,
    handleChange,
    handleSubmit,
    submitButtonText,
    submitButtonIcon,
}) {
    return (
        <div className="admin-content mt-4">

            {/* ===== HEADER ===== */}
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
                                <Link to="/admin/Home">
                                    <i className="fa fa-cogs me-1"></i> How It Works
                                </Link>
                            </li>

                            <li className="breadcrumb-item active">
                                {breadcrumbText}
                            </li>
                        </ol>
                    </nav>
                </div>

                <span className="badge eco-badge">Admin Panel</span>
            </div>

            {/* ===== FORM CARD ===== */}
            <div className="row justify-content-center">
                <div className="col-lg-8">

                    <div className="card shadow-sm border-0">
                        <div className="card-body">

                            <form onSubmit={handleSubmit}>

                                {/* Title */}
                                <div className="mb-3">
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={form.title}
                                        className={`form-control ${errors.title ? "is-invalid" : ""}`}
                                        onChange={handleChange}
                                    />
                                    {errors.title && (
                                        <div className="invalid-feedback">
                                            {errors.title}
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        name="description"
                                        rows="4"
                                        value={form.description}
                                        className={`form-control ${errors.description ? "is-invalid" : ""}`}
                                        onChange={handleChange}
                                    />
                                    {errors.description && (
                                        <div className="invalid-feedback">
                                            {errors.description}
                                        </div>
                                    )}
                                </div>

                                {/* Icon + Order */}
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Icon (FontAwesome class)</label>
                                        <input
                                            type="text"
                                            name="icon"
                                            placeholder="fa-solid fa-user"
                                            value={form.icon}
                                            className={`form-control ${errors.icon ? "is-invalid" : ""}`}
                                            onChange={handleChange}
                                        />
                                        {errors.icon && (
                                            <div className="invalid-feedback">
                                                {errors.icon}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Order</label>
                                        <input
                                            type="number"
                                            name="order"
                                            value={form.order}
                                            className={`form-control ${errors.order ? "is-invalid" : ""}`}
                                            onChange={handleChange}
                                        />
                                        {errors.order && (
                                            <div className="invalid-feedback">
                                                {errors.order}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Is Active */}
                                <div className="mb-3">
                                    <label className="form-label">Is Active</label>
                                    <select
                                        name="is_active"
                                        value={form.is_active ? "true" : "false"}
                                        className="form-select"
                                        onChange={handleChange}
                                    >
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </select>
                                </div>

                                <button type="submit" className="add-btn w-100 py-2">
                                    <i className={`fa ${submitButtonIcon} me-1`}></i>
                                    {submitButtonText}
                                </button>

                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}