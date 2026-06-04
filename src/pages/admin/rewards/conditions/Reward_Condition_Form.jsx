import React from "react";
import { Link } from "react-router-dom";
import Page_Header_Edit_or_Add from "../../shared/common/Page_Header_Edit__or__Add";

export default function Reward_Condition_Form({
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

                breadIcon="fa-list-check"
                listLink="/admin/Reward-Condition"
                listName="Reward Conditions List"
            />

            {/* ===== FORM CARD ===== */}
            <div className="row justify-content-center">
                <div className="col-lg-8">

                    <div className="card shadow-sm border-0">
                        <div className="card-body">

                            <form onSubmit={handleSubmit}>


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

                                {/* Title */}
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
                                        <div className="invalid-feedback">
                                            {errors.name}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Display Name</label>
                                    <input
                                        type="text"
                                        name="display_name"
                                        value={form.display_name}
                                        className={`form-control ${errors.display_name ? "is-invalid" : ""}`}
                                        onChange={handleChange}
                                    />
                                    {errors.display_name && (
                                        <div className="invalid-feedback">
                                            {errors.display_name}
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