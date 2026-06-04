import React from "react";
// eslint-disable-next-line no-unused-vars
import { Link } from "react-router-dom";
import Page_Header_Edit_or_Add from "../Common Files/Page_Header_Edit__or__Add";

export default function Reward_Rules_Form({
    headingText,
    headingIcon,
    breadcrumbText,

    isEdit,

    categories,
    conditions,

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
                listLink="/admin/Reward-Rules"
                listName="Reward Rules List"
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
                                    <label className="form-label">Condition</label>
                                    <select
                                        name="condition_id"
                                        value={form.condition_id}
                                        className={`form-select ${errors.condition_id ? "is-invalid" : ""}`}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Condition</option>

                                        {conditions.map(cond => (
                                            <option key={cond.id} value={cond.id}>
                                                {cond.display_name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.condition_id && (
                                        <div className="invalid-feedback d-block">
                                            {Array.isArray(errors.condition_id)
                                                ? errors.condition_id[0]
                                                : errors.condition_id}
                                        </div>
                                    )}
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        {/* Points */}
                                        <div className="mb-3">
                                            <label className="form-label">Points</label>
                                            <input
                                                type="number"
                                                name="points"
                                                value={form.points}
                                                className={`form-control ${errors.points ? "is-invalid" : ""}`}
                                                onChange={handleChange}
                                            />
                                            {errors.points && (
                                                <div className="invalid-feedback">
                                                    {errors.points}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        {/* Unit */}
                                        <div className="mb-3">
                                            <label className="form-label">Unit</label>
                                            <select
                                                name="unit"
                                                value={form.unit}
                                                className={`form-select ${errors.unit ? "is-invalid" : ""}`}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Unit</option>
                                                <option value="item">Item</option>
                                                <option value="kg">Kg</option>
                                            </select>
                                            {errors.unit && (
                                                <div className="invalid-feedback d-block">
                                                    {Array.isArray(errors.unit)
                                                        ? errors.unit[0]
                                                        : errors.unit}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* IS ACTIVE */}
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
