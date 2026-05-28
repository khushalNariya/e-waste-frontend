import React from "react";
import { Link } from "react-router-dom";
import Page_Header_Edit_or_Add from "../Common Files/Page_Header_Edit__or__Add";

export default function Category_Brand_Mapping_Form({
    headingText,
    headingIcon,
    breadcrumbText,

    form,
    errors,
    handleChange,
    handleSubmit,
    submitButtonText,
    submitButtonIcon,

    categories,
    brands
}) {
    return (
        <div className="admin-content mt-4">

            <Page_Header_Edit_or_Add
                headingText={headingText}
                headingIcon={headingIcon}
                breadcrumbText={breadcrumbText}

                breadIcon="fa-tags"
                listLink="/admin/Category-Brand-Mapping"
                listName="Category - Brand - Mapping List"
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


                                {/* Category */}
                                <div className="mb-3">
                                    <label className="form-label">Category</label>
                                    <select
                                        name="category_id"
                                        value={form.category_id}
                                        className={`form-select ${errors.category_id ? "is-invalid" : ""}`}
                                        onChange={handleChange}

                                        style={{ maxHeight: "150px", overflowY: "auto" }}
                                    >
                                        <option value="">Select Category</option>

                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.title}
                                            </option>
                                        ))}
                                    </select>
                                    {/* {errors.name && (
                                            <div className="invalid-feedback">
                                                {errors.name}
                                            </div>
                                        )} */}
                                    {errors.category_id && (
                                        <div className="invalid-feedback d-block">
                                            {errors.category_id[0]}
                                        </div>
                                    )}
                                </div>

                                {/* BRAND */}
                                <div className="mb-3">
                                    <label className="form-label">Brand</label>
                                    <select
                                        name="brand_id"
                                        value={form.brand_id}
                                        className={`form-select ${errors.brand_id ? "is-invalid" : ""}`}
                                        onChange={handleChange}

                                    >
                                        <option value="">Select Brand</option>

                                        {brands.map(br => (
                                            <option key={br.id} value={br.id}>
                                                {br.name}
                                            </option>
                                        ))}
                                    </select>

                                    {errors.brand_id && (
                                        <div className="invalid-feedback d-block">
                                            {errors.brand_id[0]}
                                        </div>
                                    )}
                                </div>

                                {/* IS ACTIVE */}
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