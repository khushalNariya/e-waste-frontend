import React from "react";
// eslint-disable-next-line no-unused-vars
import { Link } from "react-router-dom";
import Page_Header_Edit_or_Add from "../Common Files/Page_Header_Edit__or__Add";

export default function Reward_Category_Form({
    headingText,
    headingIcon,
    breadcrumbText,

    isEdit,

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
                listLink="/admin/Reward-Category"
                listName="Reward Category List"
            />

            {/* ===== FORM CARD ===== */}
            <div className="row justify-content-center">
                <div className="col-lg-8">

                    <div className="card shadow-sm border-0">
                        <div className="card-body">

                            <form onSubmit={handleSubmit}>

                                {/*  ADD HERE */}
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
                                <div className="row">

                                    {/* BIG COLUMN */}
                                    <div className="col-md-8">
                                        <div className="mb-3">
                                            <label className="form-label">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                                onChange={handleChange}
                                            />

                                            {errors.name && (
                                                <div className="invalid-feedback d-block">
                                                    {Array.isArray(errors.name)
                                                        ? errors.name[0]
                                                        : errors.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* SMALL COLUMN */}
                                    <div className="col-md-4">
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
