import React from "react";
import { Link } from "react-router-dom";
import Page_Header_Edit_or_Add from "../../shared/common/Page_Header_Edit__or__Add";

export default function Product_Name_Form({
    headingText,
    headingIcon,
    breadcrumbText,

    isEdit,

    categories,
    brands,

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


            <Page_Header_Edit_or_Add
                headingText={headingText}
                headingIcon={headingIcon}
                breadcrumbText={breadcrumbText}

                breadIcon="fa-list"
                listLink="/admin/Product-Name"
                listName="Product Name List"
            />

            {/* ===== FORM CARD ===== */}
            <div className="row justify-content-center">
                <div className="col-lg-8">

                    <div className="card shadow-sm border-0">
                        <div className="card-body">

                            <form onSubmit={handleSubmit}>

                                {/* 🔥 ADD HERE */}
                                {errors.non_field_errors && (
                                    <div className="alert alert-danger">
                                        {errors.non_field_errors[0]}
                                    </div>
                                )}



                                {/* ID FIELD (ONLY EDIT MODE) */}
                                {isEdit && (
                                    <div className="mb-3">
                                        <label className="form-label">ID</label>
                                        <input
                                            type="text"
                                            value={form.id}
                                            className="form-control"
                                            readOnly   // ❗ user change nahi kar sakta
                                        />
                                    </div>
                                )}

                                {/* Category */}
                                <div className="mb-3">
                                    <label className="form-label">Category</label>
                                    <select
                                        name="category_id"
                                        value={form.category_id}
                                        className={`form-select ${errors.category_id ? "is-invalid" : ""}`}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Category</option>

                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.title}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && (
                                        <div className="invalid-feedback d-block">
                                            {Array.isArray(errors.category_id)
                                                ? errors.category_id[0]
                                                : errors.category_id}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Brand</label>
                                    <select
                                        name="brand_id"
                                        value={form.brand_id}
                                        className={`form-select ${errors.brand_id ? "is-invalid" : ""}`}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Brand</option>

                                        {brands.map(cond => (
                                            <option key={cond.id} value={cond.id}>
                                                {cond.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.brand_id && (
                                        <div className="invalid-feedback d-block">
                                            {Array.isArray(errors.brand_id)
                                                ? errors.brand_id[0]
                                                : errors.brand_id}
                                        </div>
                                    )}
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        {/* Model - Name */}
                                        <div className="mb-3">
                                            <label className="form-label">Product Model Name</label>
                                            <input
                                                type="text"
                                                name="model_name"
                                                value={form.model_name}
                                                className={`form-control ${errors.model_name ? "is-invalid" : ""}`}
                                                onChange={handleChange}
                                            />
                                            {errors.model_name && (
                                                <div className="invalid-feedback">
                                                    {errors.model_name}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        {/* Status */}
                                        <div className="mb-3">

                                            <label className="form-label">Status</label>
                                            <select
                                                name="is_active"
                                                value={form.is_active ? "true" : "false"}
                                                className="form-select"
                                                onChange={handleChange}
                                            >
                                                <option value="true">Active</option>
                                                <option value="false">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
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